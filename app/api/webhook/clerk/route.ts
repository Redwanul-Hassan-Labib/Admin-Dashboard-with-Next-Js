import { clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';
import { IUser } from '@/types/user';

// Define Webhook Event interface for proper typing
interface WebhookEvent {
  type: string;
  data: unknown;
}

// Define specific event data interfaces
interface UserCreatedEvent {
  id: string;
  email_addresses: { email_address: string }[];
  image_url: string;
  first_name: string;
  last_name: string;
}

interface UserUpdatedEvent {
  id: string;
  image_url: string;
  first_name: string;
  last_name: string;
}

interface UserDeletedEvent {
  id: string;
}

interface WebhookError extends Error {
  code?: number;
}

export async function POST(req: NextRequest) {
  const SIGNING_SECRET = process.env.WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data as UserCreatedEvent;

    const user = {
      clerkUserId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      profilePicture: image_url,
    };

    try {
      const newUser = await createUser(user as IUser);
      const client = await clerkClient();

      if (newUser) {
        try {
          await client.users.updateUser(id, {
            publicMetadata: {
              userId: newUser.id,
              role: newUser.role || 'customer',
            },
          });
        } catch (error) {
          console.error('Error updating Clerk user metadata:', error);
        }
      }

      return NextResponse.json({ message: 'OK', user: newUser });
    } catch (error: unknown) {
      const webhookError = error as WebhookError;
      if (webhookError.code === 11000) {
        return new Response('Duplicate key error', { status: 400 });
      }
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, image_url, first_name, last_name } = evt.data as UserUpdatedEvent;

    const user = {
      firstName: first_name,
      lastName: last_name,
      profilePicture: image_url,
    };

    try {
      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: 'OK', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data as UserDeletedEvent;

    try {
      const deletedUser = await deleteUser(id);
      return NextResponse.json({ message: 'OK', user: deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}

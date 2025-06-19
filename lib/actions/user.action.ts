'use server';

import { IUser } from '@/types/user';
import dbConnect from '../db-connect';

import User from '@/models/user.model';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

// create a new user
export async function createUser(userData: IUser) {
  try {
    await dbConnect();
    const user = await User.findOne({ clerkUserId: userData.clerkUserId });

    if (user) return user;

    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// update an existing user
export async function updateUser(clerkUserId: string, user: Partial<IUser>) {
  try {
    await dbConnect();
    return await User.findOneAndUpdate({ clerkUserId }, user, {
      new: true,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// delete an existing user
export async function deleteUser(clerkUserId: string) {
  try {
    await dbConnect();
    return await User.deleteOne({ clerkUserId });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// get a single user using clerk user id
export const getUser = cache(async (clerkUserId: string) => {
  try {
    await dbConnect();
    return await User.findOne({ clerkUserId });
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
});

// get all user for admin
export const getUsersForAdmin = cache(async ({ page = 1, limit = 10, search = '' }) => {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== 'admin') {
      throw new Error("Don't have permission to perform this action!");
    }

    // Initialize query object
    const query = {
      role: { $ne: 'admin' },
      ...(search && {
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
      }),
    };

    // Execute aggregation
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Count total documents matching the query
    const total = await User.countDocuments({
      ...(search && query),
    });

    const totalPages = Math.ceil(total / limit);

    return JSON.parse(
      JSON.stringify({
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }),
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
});

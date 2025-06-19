export interface IUser {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  profilePicture: string;
  slug: string;
}

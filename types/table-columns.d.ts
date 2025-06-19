import { BaseRecord } from '@/components/dashboard/data-table';

export interface UserRecord extends BaseRecord {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

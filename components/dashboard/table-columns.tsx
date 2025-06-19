'use client';

import { UserRecord } from '@/types/table-columns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { createDragColumn, createSelectionColumn } from './data-table';

// Customer columns for admin
export const adminUsersColumns: ColumnDef<UserRecord>[] = [
  createDragColumn<UserRecord>(),
  createSelectionColumn<UserRecord>(),
  {
    accessorKey: 'Name & Mail',
    header: 'Name & Mail',
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={row.original.profilePicture} alt={row.original.firstName} />
          <AvatarFallback>{row.original.firstName}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="max-w-xs truncate text-sm font-medium">
            {row.original.firstName} {row.original.lastName}
          </h1>
          <p className="text-muted-foreground text-sm">{row.original.email}</p>
        </div>
      </div>
    ),
    filterFn: 'includesString',
    enableHiding: false,
  },
  {
    accessorKey: 'Role',
    header: 'Role',
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1 capitalize">
          {row.original.role}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Created At',
    header: 'Created At',
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.createdAt), 'PPP')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Updated At',
    header: 'Updated At',
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.updatedAt), 'PPP')}
        </Badge>
      </div>
    ),
  },
];

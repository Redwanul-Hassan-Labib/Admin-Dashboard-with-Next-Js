'use client';

import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, UniqueIdentifier, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Table as TableInstance,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import SearchBar from '../global/search-bar';
import DataTableColumnSelector from './data-table-column-selector';
import DataTableFooter from './data-table-footer';

// Base interface for records that can be used in the DataTable
export interface BaseRecord {
  _id?: string | number;
  id?: string | number;
  [key: string]: unknown;
}

interface DragHandleProps {
  id: UniqueIdentifier;
}

// Create a separate component for the drag handle
function DragHandle({ id }: DragHandleProps) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

interface DraggableRowProps<T extends BaseRecord> {
  row: Row<T>;
  uniqueIdProperty: string;
}

// Pass uniqueIdProperty directly to DraggableRow
function DraggableRow<T extends BaseRecord>({ row, uniqueIdProperty }: DraggableRowProps<T>) {
  const id = (row.original[uniqueIdProperty] || row.original._id || row.original.id) as UniqueIdentifier;

  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

interface DataTableProps<T extends BaseRecord> {
  data?: T[];
  columns?: ColumnDef<T>[];
  pageSize?: number;
  pageIndex?: number;
  total?: number;
  uniqueIdProperty?: string;
  defaultSort?: ColumnSort[];
  enableRowSelection?: boolean;
  onDeleteMany?: (ids: string[]) => Promise<void>;
  actionLink?: {
    href: string;
    label: string;
  };
}

export default function DataTable<T extends BaseRecord>({
  data: initialData = [],
  columns = [],
  pageSize = 10,
  pageIndex = 0,
  total = 0,
  uniqueIdProperty = '_id',
  defaultSort = [],
  enableRowSelection = true,
  onDeleteMany,
  actionLink,
}: DataTableProps<T>) {
  // States for table functionality
  const [data, setData] = React.useState<T[]>(initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>(defaultSort);
  const searchParams = useSearchParams();
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: pageIndex ? pageIndex - 1 : 0,
    pageSize: Number(searchParams.get('pageSize')) || pageSize,
  });

  const sortableId = React.useId();
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  // Store uniqueIdProperty in a ref to avoid it being undefined during renders
  const uniqueIdRef = React.useRef(uniqueIdProperty);
  uniqueIdRef.current = uniqueIdProperty;

  // Generate draggable IDs
  const dataIds = React.useMemo(() => {
    // Add safety checks
    if (!data || !Array.isArray(data)) return [];
    return data
      .map((item) => {
        const id = item[uniqueIdRef.current] || item._id || item.id;
        return id as UniqueIdentifier;
      })
      .filter(Boolean) as UniqueIdentifier[];
  }, [data]);

  // Set up table
  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => {
      const id = row[uniqueIdRef.current] || row._id || row.id;
      return id ? id.toString() : '';
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting as OnChangeFn<SortingState>,
    onColumnFiltersChange: setColumnFilters as OnChangeFn<ColumnFiltersState>,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Handle drag and drop reordering
  function handleDragEnd(event: { active: { id: UniqueIdentifier }; over: { id: UniqueIdentifier } | null }) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((dataTwo) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(dataTwo, oldIndex, newIndex);
        }
        return dataTwo;
      });
    }
  }

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData || []);
  }, [initialData]);

  // Update pagination when URL params change
  React.useEffect(() => {
    const urlPageSize = Number(searchParams.get('pageSize'));
    if (urlPageSize) {
      setPagination((prev) => ({
        ...prev,
        pageSize: urlPageSize,
      }));
    }
  }, [searchParams, pageSize]);

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Update selectedIds when rowSelection changes
  React.useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original._id).filter((id): id is string => typeof id === 'string');
    setSelectedIds(ids);
  }, [rowSelection, table]);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0 || !onDeleteMany) return;

    toast.promise(
      onDeleteMany(selectedIds).then(() => {
        table.resetRowSelection();
        setIsDialogOpen(false);
      }),
      {
        loading: 'Deleting selected items...',
        success: 'Items deleted successfully',
        error: 'Failed to delete items',
      },
    );
  };

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6 overflow-hidden">
      <div className="flex flex-wrap justify-center gap-4 sm:flex-row sm:items-center sm:justify-normal sm:gap-2">
        <DataTableColumnSelector table={table} />
        {actionLink && (
          <Link
            href={actionLink.href}
            className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex h-8 items-center gap-1.5 rounded-md border px-3 text-sm font-medium shadow-xs has-[>svg]:px-2.5">
            <IconPlus size={16} />
            <span>{actionLink.label}</span>
          </Link>
        )}
        <SearchBar />
        {onDeleteMany && selectedIds.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-8">
                Delete ({selectedIds.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Selected Items</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {selectedIds.length} selected item{selectedIds.length > 1 ? 's' : ''}? This action cannot be undone and will permanently remove the selected item
                  {selectedIds.length > 1 ? 's' : ''} from the database.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteMany}>
                  Yes, Delete {selectedIds.length > 1 ? 'All' : 'It'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto rounded-lg">
        <div className="bg-light overflow-hidden rounded-lg border dark:bg-transparent">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
            <Table>
              <TableHeader className="bg-light-bg/50 dark:bg-dark-hover sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} uniqueIdProperty={uniqueIdRef.current} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <DataTableFooter table={table} pageSize={pageSize} total={total} />
      </TabsContent>
    </Tabs>
  );
}

// Helper function to create a drag column
export function createDragColumn<T extends BaseRecord>() {
  return {
    id: 'drag',
    header: () => null,
    cell: ({ row }: { row: Row<T> }) => {
      // Access the id directly from the row original data
      const id = row.original._id || row.original.id || row.id;
      return <DragHandle id={id as UniqueIdentifier} />;
    },
  };
}

// Helper function to create a selection checkbox column
export function createSelectionColumn<T extends BaseRecord>() {
  return {
    id: 'select',
    header: ({ table }: { table: TableInstance<T> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className={'border-[#e9e4e4] dark:border-[#383838]'}
        />
      </div>
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

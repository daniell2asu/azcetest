'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  PageSize,
  SortableField,
} from '~/lib/data-table/types';
import { useSearchParamsTableState } from '~/app/(dashboard)/dashboard/_components/ActivityFeed/useTableSearchParams';

type UseDataTableProps<TData, TValue> = {
  /**
   * The data for the table
   * @default []
   * @type TData[]
   */
  data: TData[];

  /**
   * The columns of the table
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The number of pages in the table
   * @type number
   */
  pageCount: number;

  /**
   * The searchable columns of the table
   * @default []
   * @type {id: keyof TData, title: string}[]
   * @example searchableColumns={[{ id: "title", title: "titles" }]}
   */
  searchableColumns?: DataTableSearchableColumn<TData>[];

  /**
   * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
   * @default []
   * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]}[]
   * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];
};

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  searchableColumns = [],
  filterableColumns = [],
}: UseDataTableProps<TData, TValue>) {
  const { searchParams, setSearchParams } = useSearchParamsTableState();

  const filterableColumnIds = filterableColumns.map((column) => column.id);

  // Table states
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    searchParams.filterParams ?? [],
  );

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: searchParams.page - 1,
      pageSize: searchParams.perPage,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  // Sync any changes to columnFilters back to searchParams
  React.useEffect(() => {
    if (!columnFilters || columnFilters.length === 0) {
      void setSearchParams.setFilterParams(null);
      return;
    }

    void setSearchParams.setFilterParams(columnFilters);
  }, [columnFilters]);

  React.useEffect(() => {
    setPagination({
      pageIndex: searchParams.page - 1,
      pageSize: searchParams.perPage,
    });
  }, [searchParams.page, searchParams.perPage]);

  React.useEffect(() => {
    void setSearchParams.setPage(pageIndex + 1);
    void setSearchParams.setPerPage(pageSize as PageSize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: searchParams.sortField,
      desc: searchParams.sort === 'desc',
    },
  ]);

  React.useEffect(() => {
    void setSearchParams.setSort(sorting[0]?.desc ? 'desc' : 'asc');
    void setSearchParams.setSortField(sorting[0]?.id as SortableField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  console.log({ columnFilters, filterableColumns, searchableColumns });

  const dataTable = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { dataTable };
}

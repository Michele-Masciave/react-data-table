import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useReactDataTableState } from "../useReactDataTableState/useReactDataTableState";
import Skeleton from "react-loading-skeleton";
import { useReactDataTableProps } from "./useReactDataTableProps";
import { useReactDataTableResult } from "./useReactDataTableResult";
import { RowWithSortIndex } from "../ReactDataTable/ReactDataTable";
import { useSortable } from "@dnd-kit/sortable";

/**
 * A react hook that returns a react table instance and the state of the table
 */
const useReactDataTable = <TData extends RowWithSortIndex>(props: useReactDataTableProps<TData>): useReactDataTableResult<TData> => {
  //FIXME maybe add in useReactDataTableProps the id should be used for dragging
  const {
    data = [],
    columns,
    isLoading,
    initialState,
    manualFiltering,
    manualPagination,
    manualSorting,
    state,
    onColumnFiltersChange,
    onPaginationChange,
    onSortingChange,
    reactTableOptions,
  } = props;
  const { columnFilters: columnFiltersInitial, sorting: sortingInitial, pagination: paginationInitial } = initialState ?? {};
  const { columnFilters: columnFiltersExternal, pagination: paginationExternal, sorting: sortingExternal } = state ?? {};

  const {
    columnFilters: columnFiltersInternal,
    pagination: paginationInternal,
    sorting: sortingInternal,
    setColumnFilters: setColumnFiltersInternal,
    setPagination: setPaginationInternal,
    setSorting: setSortingInternal,
  } = useReactDataTableState({
    initialColumnFilters: columnFiltersInitial,
    initialPagination: paginationInitial,
    initialSorting: sortingInitial,
  });

  const effectiveColumnFilters = columnFiltersExternal ?? columnFiltersInternal;
  const effectivePagination = paginationExternal ?? paginationInternal;
  const effectiveSorting = sortingExternal ?? sortingInternal;
  const effectiveOnColumnFiltersChange = onColumnFiltersChange ?? setColumnFiltersInternal;
  const effectiveOnPaginationChange = onPaginationChange ?? setPaginationInternal;
  const effectiveOnSortingChange = onSortingChange ?? setSortingInternal;

  // If we active the manual filtering, we have to unset the filterfunction, else it still does automatic filtering
  if (manualFiltering) columns.forEach((x) => (x.filterFn = undefined));

  const skeletonColumns = columns.map((column) => ({
    ...column,
    cell: () => <Skeleton />,
  }));
  const skeletonData = Array.from({ length: paginationInternal.pageSize }, () => ({} as TData));

  // FIXME

  // Cell Component
  const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const { attributes, listeners } = useSortable({
      id: rowId,
      resizeObserverConfig: {},
    });
    return (
      // Alternatively, you could set these attributes on the rows themselves
      <button {...attributes} {...listeners}>
        🟰
      </button>
    );
  };

  const columnsDraggable = [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    ...columns,
  ];

  const table = useReactTable<TData>({
    data: isLoading ? skeletonData : data,
    columns: isLoading ? skeletonColumns : columnsDraggable,

    onColumnFiltersChange: (filtersOrUpdaterFn) => {
      const newFilter = typeof filtersOrUpdaterFn !== "function" ? filtersOrUpdaterFn : filtersOrUpdaterFn(effectiveColumnFilters);
      return effectiveOnColumnFiltersChange(newFilter);
    },
    onPaginationChange: (paginationOrUpdaterFn) => {
      const newFilter = typeof paginationOrUpdaterFn !== "function" ? paginationOrUpdaterFn : paginationOrUpdaterFn(effectivePagination);
      return effectiveOnPaginationChange(newFilter);
    },
    onSortingChange: (sortingOrUpdaterFn) => {
      const newFilter = typeof sortingOrUpdaterFn !== "function" ? sortingOrUpdaterFn : sortingOrUpdaterFn(effectiveSorting);
      return effectiveOnSortingChange(newFilter);
    },

    state: {
      columnFilters: effectiveColumnFilters,
      pagination: effectivePagination,
      sorting: effectiveSorting,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualFiltering,
    manualPagination,
    manualSorting,

    enableMultiSort: false,

    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
    },

    getRowId: (row) => `${row.sortIndex}`, // FIXME: which id? string or number?

    ...reactTableOptions,
  });

  return {
    table,
    columnFilters: effectiveColumnFilters,
    pagination: effectivePagination,
    sorting: effectiveSorting,
    setColumnFilters: effectiveOnColumnFiltersChange,
    setPagination: effectiveOnPaginationChange,
    setSorting: effectiveOnSortingChange,
  };
};

export { useReactDataTable, useReactDataTableProps, useReactDataTableResult };

import { TableState } from "@tanstack/react-table";
import { useReactDataTable } from "../useReactDataTable/useReactDataTable";
import { useReactDataTableProps } from "../useReactDataTable/useReactDataTableProps";
import { useReactDataTableResult } from "../useReactDataTable/useReactDataTableResult";
import { RowWithSortIndex } from "../ReactDataTable/ReactDataTable";

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

interface useFullyControlledReactDataTableProps<TData>
  extends WithRequired<
    Omit<useReactDataTableProps<TData>, "manualFiltering" | "manualPagination" | "manualSorting">,
    "onColumnFiltersChange" | "onPaginationChange" | "onSortingChange"
  > {
  state: {
    columnFilters: TableState["columnFilters"];
    pagination: TableState["pagination"];
    sorting: TableState["sorting"];
  };
}

/**
 * A helper hook to use the useReactDataTable hook which is fully controlled. Useful for server side filtering, sorting and pagination.
 */
const useFullyControlledReactDataTable = <TData extends RowWithSortIndex>(
  props: useFullyControlledReactDataTableProps<TData>,
): useReactDataTableResult<TData> =>
  useReactDataTable<TData>({ manualFiltering: true, manualPagination: true, manualSorting: true, ...props });

export { useFullyControlledReactDataTable };

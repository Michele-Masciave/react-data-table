import { ColumnPinningState, CoreOptions } from "@tanstack/react-table";
import { SortingState } from "./SortingState";

/**
 * Object type implementation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FilterModel = { [k: string]: any };

/**
 * The table sorting state
 */
interface TableState<TData, TFilter extends FilterModel>
  extends Pick<CoreOptions<TData>["state"], "pagination" | "rowSelection" | "expanded"> {
  /**
   * The column filters state
   */
  columnFilters?: TFilter;
  /**
   * The sorting state
   */
  sorting?: SortingState<TData>;
  /**
   * The column pinning state
   */
  columnPinning?: ColumnPinningState;
}

export { TableState, FilterModel };

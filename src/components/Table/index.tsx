"use client";

import React, { useState, useMemo, ChangeEvent, KeyboardEvent } from "react";
import StarRatings from "react-star-ratings";
import { Search } from "lucide-react";
import styles from "./Table.module.css";

export type TableColumn<T extends object> = {
  key: keyof T;
  label: string;
  width?: string;
};

interface TableProps<T extends object> {
  data: T[];
  columns: TableColumn<T>[];
  searchableKey?: keyof T;
  filterOptions?: {
    key: keyof T;
    values: Array<T[keyof T] & string>;
  };
  pageSize?: number;
  total: number;
  loading: boolean;
  onPageChange?: (skip: number, search: string, category: string) => void;
  onSearch?: (search: string) => void;
  onFilter?: (category: string) => void;
}

export function Table<T extends object>({
  data,
  columns,
  searchableKey,
  filterOptions,
  pageSize = 10,
  total,
  loading = false,
  onPageChange,
  onSearch,
  onFilter,
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  const updatePage = (newPage: number) => {
    setPage(newPage);
    onPageChange?.((newPage - 1) * pageSize, search, filter);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      setPage(1);
      onSearch?.("");
    }
  };

  const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setPage(1);
    setFilter("");
    onSearch?.(search);
  }

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter(value);
    setPage(1);
    setSearch("");
    onFilter?.(value);
  };

  const renderCell = (key: keyof T, value: T[keyof T]) => {
    if (value === undefined || value === null)
      return <span className="text-gray-400">N/A</span>;

    if (key === "rating" && typeof value === "number") {
      return (
        <StarRatings
          rating={value}
          starRatedColor="orange"
          starDimension="16px"
          starSpacing="0px"
        />
      );
    }

    if (key === "price" && typeof value === "number") {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }

    return String(value);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {searchableKey && (
          <div className="relative w-full max-w-xs">
            <input
              className="border border-gray-300 px-3 py-2 rounded text-gray-700 w-full max-w-xs text-sm"
              placeholder={`Search by ${String(
                searchableKey
              )}...`}
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchEnter}
            />

            <Search onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
          </div>
        )}

        {filterOptions && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="categoryFilter"
              className="text-sm font-medium text-gray-500 whitespace-nowrap"
            >
              Filter by category
            </label>
            <select
              id="categoryFilter"
              className="border border-gray-300 px-3 py-2 rounded text-gray-700 text-sm"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {filterOptions.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        className={`overflow-x-auto md:overflow-x-visible rounded border border-gray-200 shadow bg-white ${styles.tableContainer}`}
      >
        <table className="min-w-full">
          {!loading && (
            <thead>
              <tr className="bg-gray-100 text-left">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`p-3 border-b border-gray-200 text-gray-600 ${
                      col.width ?? ""
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex items-center justify-center h-159">
                    <div className="text-center text-sm text-gray-500">
                      Loading...
                    </div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`p-3 border-b border-gray-200 text-[0.9375rem] text-gray-600 ${
                        col.width ?? ""
                      }`}
                    >
                      {renderCell(col.key, row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => updatePage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => updatePage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import StarRatings from "react-star-ratings";

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
  data: filteredData,
  columns,
  searchableKey,
  filterOptions,
  pageSize = 10,
  total,
  onPageChange,
  onSearch,
  loading = false,
  onFilter
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const handlePageChange = (changeFn: (currentPage: number) => number) => {
    const newPage = changeFn(page);
    setPage(newPage);
    if (!onPageChange) return;
    onPageChange((newPage - 1) * pageSize, search, filter);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        {searchableKey && (
          <input
            className="border border-gray-200 px-3 py-2 rounded w-full max-w-sm"
            placeholder={`Search by ${String(
              searchableKey
            )}... (type and press enter)`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value == "") {
                if (onSearch) {
                  onSearch("");
                }
                setPage(1);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (onSearch) {
                  onSearch(search);
                }
                setPage(1);
                setFilter("");
              }
            }}
          />
        )}
        {filterOptions && (
          <select
            className="border border-gray-200 px-3 py-2 rounded text-gray-600"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              if (onFilter) {
                onFilter(e.target.value);
                setSearch("");
              }
              setPage(1);
            }}
          >
            <option value="">All</option>
            {filterOptions.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow rounded">
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
                  <div className="text-center text-lg font-medium">
                    Loading...
                  </div>
                </div>
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`p-3 border-b border-gray-200 text-gray-600 ${
                      col.width ?? ""
                    }`}
                  >
                    {typeof row[col.key] !== "undefined" ? (
                      col.key === "rating" ? (
                        <StarRatings
                          rating={row[col.key] as number}
                          starRatedColor="orange"
                          starDimension="20px"
                          starSpacing="0px"
                        />
                      ) : col.key === "price" ? (
                        (row[col.key] as number).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      ) : (
                        String(row[col.key])
                      )
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange((p) => Math.min(p + 1, totalPages))}
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

'use client';

import React, { useState, useMemo } from 'react';

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
  onPageChange?: (newPage: number, newSkip: number) => void;
}

export function Table<T extends object>({
  data,
  columns,
  searchableKey,
  filterOptions,
  pageSize = 10,
  total: totalPages,
  onPageChange,
  page = 1,
}: TableProps<T>) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchableKey) {
      filtered = filtered.filter((item) =>
        String(item[searchableKey]).toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterOptions && filter !== 'All') {
      filtered = filtered.filter((item) => item[filterOptions.key] === filter);
    }

    return filtered;
  }, [data, search, filter, searchableKey, filterOptions]);

  const handlePageChange = (changeFn: (currentPage: number) => number) => {
    const newPage = changeFn(page);
    onPageChange(newPage, (newPage - 1) * pageSize);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        {searchableKey && (
          <input
            className="border border-gray-200 px-3 py-2 rounded w-full max-w-sm"
            placeholder={`Search by ${String(searchableKey)}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        )}
        {filterOptions && (
          <select
            className="border border-gray-200 px-3 py-2 rounded text-gray-600"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value="All">All</option>
            {filterOptions.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            {columns.map((col) => (
              <th key={String(col.key)} className={`p-3 border-b border-gray-200 text-gray-600 ${col.width ?? ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className={`p-3 border-b border-gray-200 text-gray-600 ${col.width ?? ''}`}>
                  {String(row[col.key]) !== 'undefined' ? (
                      String(row[col.key])
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              ))}
            </tr>
          ))}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                No data found.
              </td>
            </tr>
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

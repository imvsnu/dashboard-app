'use client';

import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, Product } from './slice';
import { RootState, AppDispatch } from '@/lib/store';

import { Table, TableColumn } from '@/components/Table';

const columns: TableColumn<Product>[] = [
  { key: 'id', label: 'ID', width: 'w-16' },
  { key: 'title', label: 'Title', width: 'w-16' },
  { key: 'category', label: 'Category', width: 'w-16' },
  { key: 'price', label: 'Price', width: 'w-16' },
  { key: 'rating', label: 'Rating', width: 'w-16' },
  { key: 'brand', label: 'Brand', width: 'w-16' },
  { key: 'thumbnail', label: 'Thumbnail', width: 'w-16' },
];

export default function DataPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Data</h1>
      <Table
        data={data.products || []}
        columns={columns}
        searchableKey="title"
        filterOptions={{ key: 'category', values: _.uniq(data.products?.map((item: Product) => item.category) ?? []) }}
        pageSize={10}
      />
    </div>
  )
}

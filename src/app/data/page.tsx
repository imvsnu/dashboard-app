"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, Product } from "./slice";
import { RootState, AppDispatch } from "@/lib/store";

import { Table, TableColumn } from "@/components/Table";

const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

const columns: TableColumn<Product>[] = [
  { key: "id", label: "ID", width: "w-16" },
  { key: "title", label: "Title", width: "w-24" },
  { key: "category", label: "Category", width: "w-16" },
  { key: "price", label: "Price", width: "w-8" },
  { key: "brand", label: "Brand", width: "w-8" },
  { key: "rating", label: "Rating", width: "w-16" },
];

export default function DataPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.data
  );

  useEffect(() => {
    dispatch(fetchData({ skip: 0 }));
  }, [dispatch]);

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
        filterOptions={{ key: "category", values: CATEGORIES }}
        pageSize={12}
        total={data.total}
        loading={loading}
        onSearch={(search) =>
          dispatch(fetchData({ search: search }))
        }
        onFilter={(category) =>
          dispatch(fetchData({ category: category }))
        }
        onPageChange={(skip, search, category) => {
          dispatch(fetchData({ skip: skip, search: search, category: category }));
        }}
      />
    </div>
  );
}

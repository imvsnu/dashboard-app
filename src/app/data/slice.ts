import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  brand: string;
  thumbnail: string;
  rating: string;
};

type Data = {
  products?: Product[];
  limit: number;
  skip: number;
  total: number;
};

type DataState = {
  data: Data;
  loading: boolean;
  error: string | null;
};

const initialState: DataState = {
  data: { products: [], limit: 12, skip: 0, total: 0 },
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk(
  "data/fetchData",
  async ({
    skip = 0,
    search = "",
    category = "",
  }: {
    skip?: number;
    search?: string;
    category?: string;
  }) => {
    let baseUrl = "https://dummyjson.com/products";

    if (category) {
      baseUrl = `https://dummyjson.com/products/category/${category}`;
    } else if (search) {
      baseUrl = "https://dummyjson.com/products/search";
    }

    const response = await axios.get(baseUrl, {
      params: {
        q: search || undefined,
        limit: 12,
        skip,
      },
    });

    return response.data;
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default dataSlice.reducer;

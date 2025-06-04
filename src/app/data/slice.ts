import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

type Data = {
  id: number;
  title: string;
  body: string;
};

type DataState = {
  data: Data[];
  loading: boolean;
  error: string | null;
};

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
  return response.data;
});

const dataSlice = createSlice({
  name: 'data',
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
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default dataSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductsState } from './types';
import { mockProducts } from './mockData';

// Yêu cầu bài tập: dùng createAsyncThunk lấy danh sách sản phẩm từ API giả lập
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Giả lập network delay 800ms
      await new Promise(resolve => setTimeout(resolve, 800));
      // Trả về mock data thay vì fetch thật để đảm bảo luôn có data test tốt nhất
      return mockProducts;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const initialState: ProductsState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchQuery: '',
  selectedCategory: 'all'
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'An error occurred';
      });
  },
});

export const { setSearchQuery, setSelectedCategory } = productsSlice.actions;

export default productsSlice.reducer;

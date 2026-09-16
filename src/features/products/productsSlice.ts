import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductsState } from './types';
import { mockProducts } from './mockData';
import { attachStock } from './productsApi';

// createAsyncThunk: thử API thật trước, rớt mạng thì fallback mock
// để bài nộp luôn chạy ổn định khi demo offline.
export const fetchProducts = createAsyncThunk<Product[], void>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Array<{
        id: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
        rating: { rate: number; count: number };
      }>;
      return attachStock(data);
    } catch {
      try {
        // Giả lập delay nhẹ khi dùng fallback để skeleton hiển thị mượt
        await new Promise((resolve) => setTimeout(resolve, 400));
        return mockProducts;
      } catch {
        return rejectWithValue('Không tải được danh sách sản phẩm.');
      }
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
    },
    /**
     * Trừ tồn kho sau khi thanh toán thành công.
     * Nghiệp vụ: giỏ và danh sách sản phẩm là 2 slice riêng,
     * checkout phải đồng bộ kho chứ không chỉ xoá giỏ.
     */
    decreaseStock: (
      state,
      action: PayloadAction<{ id: number; quantity: number }[]>
    ) => {
      for (const purchase of action.payload) {
        const item = state.items.find((i) => i.id === purchase.id);
        if (item) {
          item.stock = Math.max(0, item.stock - purchase.quantity);
        }
      }
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

export const { setSearchQuery, setSelectedCategory, decreaseStock } =
  productsSlice.actions;

export default productsSlice.reducer;

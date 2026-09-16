import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState } from './types';
import type { Product } from '../products/types';
import type { RootState } from '../../app/store';

const initialState: CartState = {
  items: [],
  isOpen: false,
  discountCode: null,
  discountPercent: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Chỉ tăng số lượng nếu chưa vượt quá stock
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        if (product.stock > 0) {
          state.items.push({ ...product, quantity: 1 });
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else if (quantity <= item.stock) {
          item.quantity = quantity;
        }
      }
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Xoá luôn nếu số lượng < 1
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.discountCode = null;
      state.discountPercent = 0;
    },
    applyDiscount: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase();
      if (code === 'LTWNC2026') {
        state.discountCode = code;
        state.discountPercent = 15;
      } else {
        state.discountCode = null;
        state.discountPercent = 0;
      }
    }
  },
});

export const {
  toggleCart,
  openCart,
  closeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  applyDiscount
} = cartSlice.actions;

// --- SELECTORS ---
// Tối ưu selector bằng createSelector của reselect (được tích hợp sẵn trong RTK)
const selectCartItems = (state: RootState) => state.cart.items;
const selectDiscountPercent = (state: RootState) => state.cart.discountPercent;

export const selectCartTotalCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartTotalAmount = createSelector(
  [selectCartSubtotal, selectDiscountPercent],
  (subtotal, discountPercent) => {
    const discount = (subtotal * discountPercent) / 100;
    return subtotal - discount;
  }
);

export default cartSlice.reducer;

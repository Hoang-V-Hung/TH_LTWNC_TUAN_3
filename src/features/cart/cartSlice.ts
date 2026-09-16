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
  discountError: null,
  lastWarning: null,
  lastSuccess: null,
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
      state.lastWarning = null;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        // Chỉ tăng số lượng nếu chưa vượt quá stock — vượt thì báo chứ không im lặng
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
          // Đồng bộ snapshot tồn kho mới nhất từ danh sách sản phẩm
          existingItem.stock = product.stock;
        } else {
          state.lastWarning = `“${product.title}” chỉ còn ${product.stock} sản phẩm trong kho.`;
        }
      } else {
        if (product.stock > 0) {
          state.items.push({ ...product, quantity: 1 });
        } else {
          state.lastWarning = `“${product.title}” đã hết hàng.`;
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
          state.lastWarning = null;
        } else if (quantity <= item.stock) {
          item.quantity = quantity;
          state.lastWarning = null;
        } else {
          // Chặn vượt kho + báo rõ giới hạn để UI hiển thị
          item.quantity = item.stock;
          state.lastWarning = `Số lượng tối đa cho “${item.title}” là ${item.stock}.`;
        }
      }
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity < item.stock) {
          item.quantity += 1;
          state.lastWarning = null;
        } else {
          state.lastWarning = `“${item.title}” chỉ còn ${item.stock} sản phẩm trong kho.`;
        }
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
      state.discountError = null;
      state.lastWarning = null;
      state.lastSuccess = null;
    },
    /**
     * Thanh toán: xoá giỏ + lưu thông báo thành công để Toast toàn cục hiển thị.
     * Nhận message đã format sẵn từ component (component biết tổng tiền/số món).
     */
    checkoutSuccess: (state, action: PayloadAction<string>) => {
      state.items = [];
      state.discountCode = null;
      state.discountPercent = 0;
      state.discountError = null;
      state.lastWarning = null;
      state.lastSuccess = action.payload;
    },
    dismissSuccess: (state) => {
      state.lastSuccess = null;
    },
    applyDiscount: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (!code) {
        state.discountCode = null;
        state.discountPercent = 0;
        state.discountError = 'Vui lòng nhập mã giảm giá.';
        return;
      }
      if (code === 'LTWNC2026') {
        state.discountCode = code;
        state.discountPercent = 15;
        state.discountError = null;
      } else {
        state.discountCode = null;
        state.discountPercent = 0;
        state.discountError = `Mã “${action.payload.trim()}” không hợp lệ. Thử LTWNC2026.`;
      }
    },
    dismissWarning: (state) => {
      state.lastWarning = null;
    },
    clearDiscountError: (state) => {
      state.discountError = null;
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
  checkoutSuccess,
  dismissSuccess,
  applyDiscount,
  dismissWarning,
  clearDiscountError
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

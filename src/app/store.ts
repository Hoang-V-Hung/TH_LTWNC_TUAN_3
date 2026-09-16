import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import type { CartState } from '../features/cart/types';
import productsReducer from '../features/products/productsSlice';
import { productsApi } from '../features/products/productsApi';

const CART_STORAGE_KEY = 'ltwnc-cart-v1';

interface PersistedCart {
  items: CartState['items'];
  discountCode: CartState['discountCode'];
  discountPercent: CartState['discountPercent'];
}

// Nạp giỏ hàng đã lưu (persist đơn giản, không cần redux-persist).
// Nghiệp vụ thực tế: reload trang không mất giỏ.
function loadPersistedCart(): PersistedCart | undefined {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<PersistedCart>;
    if (!Array.isArray(parsed.items)) return undefined;
    return {
      items: parsed.items,
      discountCode: parsed.discountCode ?? null,
      discountPercent:
        typeof parsed.discountPercent === 'number'
          ? parsed.discountPercent
          : 0,
    };
  } catch {
    return undefined;
  }
}

const persistedCart = loadPersistedCart();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  preloadedState: persistedCart
    ? {
        cart: {
          items: persistedCart.items,
          isOpen: false, // Luôn đóng drawer khi reload để tránh kẹt UI
          discountCode: persistedCart.discountCode,
          discountPercent: persistedCart.discountPercent,
          discountError: null,
          lastWarning: null,
        },
      }
    : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Lưu giỏ mỗi khi items/discount thay đổi (ghi đè đơn giản, rẻ và đủ dùng).
store.subscribe(() => {
  try {
    const cart = store.getState().cart;
    const payload: PersistedCart = {
      items: cart.items,
      discountCode: cart.discountCode,
      discountPercent: cart.discountPercent,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Bỏ qua lỗi quota/blocked storage, không chặn nghiệp vụ chính
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

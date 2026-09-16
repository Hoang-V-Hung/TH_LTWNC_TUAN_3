import type { Product } from '../products/types';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean; // Trạng thái đóng/mở của Cart Drawer
  discountCode: string | null;
  discountPercent: number;
}

import type { Product } from '../products/types';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean; // Trạng thái đóng/mở của Cart Drawer
  discountCode: string | null;
  discountPercent: number;
  /** Lỗi khi áp mã giảm giá sai — hiển thị inline thay vì im lặng clear */
  discountError: string | null;
  /** Cảnh báo nghiệp vụ (vượt tồn kho...) — hiển thị qua Toast */
  lastWarning: string | null;
  /** Thông báo thanh toán thành công — hiển thị qua Toast xanh */
  lastSuccess: string | null;
}

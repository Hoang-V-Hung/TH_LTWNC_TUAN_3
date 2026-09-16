# LTWNC - Bài Tập Tuần 3: Redux Toolkit

Dự án này là bài tập môn Lập trình Web Nâng Cao (LTWNC) - Tuần 3, xây dựng module Giỏ hàng bằng Redux Toolkit.

## Cài đặt và Chạy

1. Cài đặt dependencies:
   ```bash
   npm install
   ```

2. Chạy ứng dụng (Môi trường dev):
   ```bash
   npm run dev
   ```

## Yêu cầu đã hoàn thành

1. **Module giỏ hàng hoàn chỉnh**: Bao gồm `cartSlice` và `productsSlice`.
2. **createAsyncThunk & RTK Query**: 
   - Sử dụng `createAsyncThunk` (`fetchProducts`) trong `productsSlice`.
   - **ĐIỂM CỘNG**: Đã tích hợp sẵn `RTK Query` qua `productsApi.ts` và có nút Toggle trên giao diện (Navbar) để chuyển đổi giữa 2 cách fetch dữ liệu nhằm mục đích biểu diễn và thử nghiệm.
3. **Cart Slice**: Hỗ trợ đầy đủ Thêm (có kiểm tra stock), Xoá, Cập nhật số lượng (tăng/giảm/nhập tay), áp mã giảm giá, và tính tổng tiền/số lượng qua `createSelector`.
4. **Typed Hooks**: Toàn bộ ứng dụng sử dụng 100% `useAppDispatch` và `useAppSelector` đã được type-safe định nghĩa tại `app/hooks.ts`. Không có import trực tiếp `useDispatch` nào trong components.
5. **Cấu trúc Feature-based**: Chuẩn cấu trúc:
   - `src/features/cart`
   - `src/features/products`
   - `src/app/store.ts`
   - `src/app/hooks.ts`
   - `src/components/Navbar.tsx`

Vui lòng đọc file `GiaiThichThietKe.md` để xem báo cáo chi tiết về cách ứng dụng Redux Toolkit.

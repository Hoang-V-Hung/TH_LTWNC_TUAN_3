# Giải thích Thiết kế: Module Giỏ hàng Redux Toolkit (Tuần 3)

## 1. Kiến trúc Feature-based
Toàn bộ logic được chia thành các thư mục độc lập theo nghiệp vụ (Feature):
- **`features/products`**: Chứa toàn bộ types, API thunk, RTK Query và UI components (ProductList, ProductCard) liên quan đến Sản phẩm.
- **`features/cart`**: Chứa toàn bộ types, slice xử lý logic giỏ hàng và UI components (CartDrawer, CartSummary) liên quan đến Giỏ hàng.
=> **Lợi ích**: Giúp dễ bảo trì, module hóa và scale dự án tốt hơn so với cấu trúc cũ (actions, reducers tách rời).

## 2. Redux Toolkit - `cartSlice`
- **Tối giản boilerplate**: Dùng `createSlice` tự động sinh ra actions và reducer.
- **Tính bất biến (Immutability)**: Nhờ có thư viện `Immer` chạy ngầm, việc thay đổi state trực tiếp (vd: `item.quantity += 1`) là hoàn toàn hợp lệ và an toàn thay vì phải copy thủ công (`...state`).
- **Selectors tối ưu**: Dùng `createSelector` (Reselect) cho việc tính `totalQuantity` và `totalAmount`. Nó giúp memoization (nhớ lại kết quả), chỉ tính toán lại khi mảng `items` thay đổi, tránh hao tốn hiệu năng khi re-render UI.

## 3. Quản lý trạng thái Bất đồng bộ
### A. `createAsyncThunk` (Yêu cầu chính)
- Hàm `fetchProducts` trong `productsSlice.ts` tự động dispatch các action: `pending`, `fulfilled`, `rejected` tuỳ thuộc vào tiến trình Promise.
- `extraReducers` sử dụng `builder.addCase` để bắt các action này và cập nhật state (loading spinner, error message) một cách mượt mà.

### B. `RTK Query` (Khuyến khích/Điểm cộng)
- Khai báo tại `productsApi.ts` qua `createApi`.
- Tự động sinh ra hook `useGetProductsQuery`.
- **Lợi ích**: Tự động quản lý cache, deduplication request, trạng thái loading/error mà không cần phải viết thêm logic trong Slice hay Thunk. Trải nghiệm trên UI được biểu diễn trực quan qua nút Toggle chuyển đổi trên Navbar.

## 4. Typed Hooks (`useAppDispatch`, `useAppSelector`)
- Định nghĩa trong `app/hooks.ts` bằng pattern `withTypes` của react-redux v9.
- **Tại sao?**: Thay vì mỗi lần dùng `useSelector` phải import `RootState` và gõ type cho `state`, hay `useDispatch` thiếu type cho thunk actions; việc bọc lại 2 hook này giúp toàn bộ component tự động nhận dạng kiểu dữ liệu an toàn 100% (Type-safe). Tuyệt đối không có bất kỳ component nào import trực tiếp cấu trúc cũ từ `react-redux`.

## 5. Nâng cấp nghiệp vụ & UI (bản cải tiến)
- **Persist giỏ hàng** (`app/store.ts`): `preloadedState` + `store.subscribe()` lưu `items/discount` vào `localStorage` (`ltwnc-cart-v1`), reload không mất giỏ; `isOpen` luôn reset `false`.
- **RTK Query thật** (`productsApi.ts`): `fetchBaseQuery('https://fakestoreapi.com/')` + `query: () => 'products'` + `transformResponse attachStock()` để có cache/dedup/refetch đúng nghĩa; `fetchProducts` thunk cũng gọi API thật trước, fallback `mockData` khi offline.
- **Phản hồi tồn kho** (`cartSlice`): vượt kho không còn im lặng — `lastWarning` hiển thị qua `Toast` toàn cục (tự tắt 3.5s); `updateQuantity` tự clamp về `stock`.
- **Mã giảm giá có lỗi rõ ràng**: `discountError` hiển thị inline (mã sai, bỏ trống), thay vì clear im lặng.
- **Drawer mượt**: giữ mount + class `open/visible`, đóng bằng Escape, khoá scroll nền, có nút "Xoá hết" và badge số lượng.
- **Thanh toán**: thay `alert()` bằng màn hình success inline trong `CartSummary`.
- **VND**: mọi giá hiển thị qua `utils/format.ts` (`Intl vi-VN VND`, tỉ giá quy đổi 1 USD = 25.000đ); `ProductList` có nút retry đúng cho cả 2 chế độ (thunk dispatch / RTK `refetch()`), đếm kết quả và nút "Xoá bộ lọc".

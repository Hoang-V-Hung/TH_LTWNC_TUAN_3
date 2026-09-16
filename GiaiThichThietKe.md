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
- Định nghĩa trong `app/hooks.ts`.
- **Tại sao?**: Thay vì mỗi lần dùng `useSelector` phải import `RootState` và gõ type cho `state`, hay `useDispatch` thiếu type cho thunk actions; việc bọc lại 2 hook này giúp toàn bộ component tự động nhận dạng kiểu dữ liệu an toàn 100% (Type-safe). Tuyệt đối không có bất kỳ component nào import trực tiếp cấu trúc cũ từ `react-redux`.

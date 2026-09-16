import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from './types';

/** Shape thô của FakeStoreAPI (không có tồn kho) */
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

/**
 * Gán tồn kho mô phỏng một cách deterministic theo id để demo
 * badge "sắp hết / hết hàng" mà không cần backend riêng.
 * id 8 luôn hết hàng để kiểm tra nút disabled.
 */
export function attachStock(items: FakeStoreProduct[]): Product[] {
  return items.map((p) => ({
    ...p,
    stock: p.id === 8 ? 0 : ((p.id * 13) % 25) + 3,
  }));
}

// RTK Query thật: gọi FakeStoreAPI qua fetchBaseQuery để phát huy
// cache/dedup/refetch — thay vì queryFn trả mock cứng như trước.
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com/' }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => 'products',
      transformResponse: (response: FakeStoreProduct[]) =>
        attachStock(response),
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;

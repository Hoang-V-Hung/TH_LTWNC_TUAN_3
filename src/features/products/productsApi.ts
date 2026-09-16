import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from './types';
import { mockProducts } from './mockData';

// Khuyến khích điểm cộng: Sử dụng RTK Query
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com/' }),
  endpoints: (builder) => ({
    // Lấy dữ liệu thật từ FakeStoreAPI (hoặc có thể mock nếu cần thiết)
    getProducts: builder.query<Product[], void>({
      // Dùng queryFn để mock dữ liệu nhằm đảm bảo UI đẹp với mockData đã chuẩn bị sẵn
      // Nếu muốn dùng API thật, đổi thành: query: () => 'products'
      queryFn: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập delay
          return { data: mockProducts };
        } catch (error) {
          return { error: { status: 500, statusText: 'Internal Server Error', data: 'Error fetching products' } };
        }
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;

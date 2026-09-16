import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts, setSearchQuery, setSelectedCategory } from './productsSlice';
import { useGetProductsQuery } from './productsApi';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface Props {
  useRtkQuery: boolean;
}

const ProductList: React.FC<Props> = ({ useRtkQuery }) => {
  const dispatch = useAppDispatch();
  const { items: sliceItems, status, error, searchQuery, selectedCategory } = useAppSelector((state) => state.products);
  
  // RTK Query hook
  const {
    data: rtkItems,
    isLoading: isRtkLoading,
    error: rtkError,
    refetch,
  } = useGetProductsQuery(undefined, {
    skip: !useRtkQuery // Bỏ qua nếu không dùng RTK Query
  });

  useEffect(() => {
    // Nếu dùng thunk và chưa load thì fetch
    if (!useRtkQuery && status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch, useRtkQuery]);

  // Hợp nhất data & status (memo để useMemo filter ổn định, hết warning lint)
  const isLoading = useRtkQuery ? isRtkLoading : (status === 'loading' || status === 'idle');
  const hasError = useRtkQuery ? !!rtkError : !!error;
  const rawItems = useMemo(
    () => (useRtkQuery ? (rtkItems ?? []) : sliceItems),
    [useRtkQuery, rtkItems, sliceItems]
  );

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return rawItems.filter(p => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [rawItems, searchQuery, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(rawItems.map(p => p.category)))];

  if (isLoading) {
    return (
      <div className="product-list-skeleton">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="skeleton-card"></div>
        ))}
      </div>
    );
  }

  if (hasError) {
    const message = useRtkQuery
      ? 'Không tải được sản phẩm từ FakeStoreAPI. Kiểm tra mạng rồi thử lại.'
      : error || 'Đã có lỗi xảy ra khi tải sản phẩm!';
    return (
      <div className="error-state">
        <h2>Đã có lỗi xảy ra khi tải sản phẩm!</h2>
        <p>{message}</p>
        <button
          onClick={() => {
            if (useRtkQuery) {
              void refetch();
            } else {
              dispatch(fetchProducts());
            }
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="filters-bar">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy sản phẩm nào.</p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              className="clear-filter-btn"
              onClick={() => {
                dispatch(setSearchQuery(''));
                dispatch(setSelectedCategory('all'));
              }}
            >
              Xoá bộ lọc
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="result-count">
            Hiển thị {filteredProducts.length}/{rawItems.length} sản phẩm
          </p>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;

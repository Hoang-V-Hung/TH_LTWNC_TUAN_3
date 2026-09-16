import React from 'react';
import type { Product } from './types';
import { useAppDispatch } from '../../app/hooks';
import { addToCart, openCart } from '../cart/cartSlice';
import { ShoppingCart, Star } from 'lucide-react';
import { formatVND } from '../../utils/format';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (outOfStock) return;
    dispatch(addToCart(product));
    dispatch(openCart());
  };

  return (
    <div className="product-card">
      <div className="image-container">
        <img src={product.image} alt={product.title} loading="lazy" />
        {lowStock && (
          <span className="badge warning">Chỉ còn {product.stock}</span>
        )}
        {outOfStock && (
          <span className="badge danger">Hết hàng</span>
        )}
      </div>
      <div className="product-info">
        <div className="category-tag">{product.category}</div>
        <h3 className="title" title={product.title}>{product.title}</h3>
        <div className="rating">
          <Star className="star-icon" size={16} fill="currentColor" />
          <span>{product.rating.rate}</span>
          <span className="count">({product.rating.count})</span>
          <span className="stock-hint">· Kho: {product.stock}</span>
        </div>
        <div className="footer">
          <span className="price">{formatVND(product.price)}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
            title={outOfStock ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ'}
          >
            <ShoppingCart size={18} />
            {outOfStock ? 'Hết hàng' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

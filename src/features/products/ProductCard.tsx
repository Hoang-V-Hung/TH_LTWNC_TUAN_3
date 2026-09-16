import React from 'react';
import type { Product } from './types';
import { useAppDispatch } from '../../app/hooks';
import { addToCart, openCart } from '../cart/cartSlice';
import { ShoppingCart, Star } from 'lucide-react';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    // Optional: open cart immediately to show feedback
    dispatch(openCart());
  };

  return (
    <div className="product-card">
      <div className="image-container">
        <img src={product.image} alt={product.title} loading="lazy" />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="badge warning">Chỉ còn {product.stock}</span>
        )}
        {product.stock === 0 && (
          <span className="badge danger">Hết hàng</span>
        )}
      </div>
      <div className="product-info">
        <div className="category-tag">{product.category}</div>
        <h3 className="title">{product.title}</h3>
        <div className="rating">
          <Star className="star-icon" size={16} fill="currentColor" />
          <span>{product.rating.rate}</span>
          <span className="count">({product.rating.count})</span>
        </div>
        <div className="footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={18} />
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

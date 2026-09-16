import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { incrementQuantity, decrementQuantity, removeFromCart, updateQuantity } from './cartSlice';
import type { CartItem } from './types';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatVND } from '../../utils/format';

interface Props {
  item: CartItem;
}

const CartItemRow: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();
  const atMax = item.quantity >= item.stock;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;
    // Chặn số âm / vượt kho ngay tại input, slice sẽ clamp + báo warning
    const clamped = Math.max(1, Math.min(value, item.stock));
    dispatch(updateQuantity({ id: item.id, quantity: clamped }));
  };

  return (
    <div className="cart-item-row">
      <img src={item.image} alt={item.title} className="item-image" loading="lazy" />
      <div className="item-details">
        <h4 className="item-title" title={item.title}>{item.title}</h4>
        <div className="item-price">{formatVND(item.price)} <span className="stock-hint">· Kho: {item.stock}</span></div>

        <div className="item-actions">
          <div className="quantity-controls">
            <button
              className="qty-btn"
              aria-label="Giảm số lượng"
              onClick={() => dispatch(decrementQuantity(item.id))}
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={handleQuantityChange}
              min={1}
              max={item.stock}
              aria-label={`Số lượng ${item.title}`}
            />
            <button
              className="qty-btn"
              aria-label="Tăng số lượng"
              onClick={() => dispatch(incrementQuantity(item.id))}
              disabled={atMax}
              title={atMax ? `Đã đạt tối đa ${item.stock}` : 'Tăng số lượng'}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            className="remove-btn"
            aria-label={`Xoá ${item.title}`}
            title="Xoá khỏi giỏ"
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            <Trash2 size={16} />
          </button>
        </div>
        {atMax && <div className="max-hint">Đã đạt số lượng tối đa trong kho</div>}
      </div>
      <div className="item-subtotal">
        {formatVND(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default CartItemRow;

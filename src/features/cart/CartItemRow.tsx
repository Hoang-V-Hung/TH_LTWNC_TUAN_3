import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { incrementQuantity, decrementQuantity, removeFromCart, updateQuantity } from './cartSlice';
import type { CartItem } from './types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface Props {
  item: CartItem;
}

const CartItemRow: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      dispatch(updateQuantity({ id: item.id, quantity: value }));
    }
  };

  return (
    <div className="cart-item-row">
      <img src={item.image} alt={item.title} className="item-image" />
      <div className="item-details">
        <h4 className="item-title">{item.title}</h4>
        <div className="item-price">${item.price.toFixed(2)}</div>
        
        <div className="item-actions">
          <div className="quantity-controls">
            <button 
              className="qty-btn" 
              onClick={() => dispatch(decrementQuantity(item.id))}
            >
              <Minus size={14} />
            </button>
            <input 
              type="number" 
              value={item.quantity} 
              onChange={handleQuantityChange}
              min="1"
              max={item.stock}
            />
            <button 
              className="qty-btn"
              onClick={() => dispatch(incrementQuantity(item.id))}
              disabled={item.quantity >= item.stock}
            >
              <Plus size={14} />
            </button>
          </div>
          
          <button 
            className="remove-btn"
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="item-subtotal">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItemRow;

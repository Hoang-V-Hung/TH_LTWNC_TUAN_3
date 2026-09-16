import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeCart } from './cartSlice';
import { X, ShoppingBag } from 'lucide-react';
import CartItemRow from './CartItemRow';
import CartSummary from './CartSummary';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, items } = useAppSelector(state => state.cart);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={() => dispatch(closeCart())} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={24} />
            <h2>Giỏ hàng của bạn</h2>
          </div>
          <button className="close-btn" onClick={() => dispatch(closeCart())}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={64} className="empty-icon" />
              <p>Giỏ hàng đang trống.</p>
              <button className="continue-shopping" onClick={() => dispatch(closeCart())}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <CartSummary />
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

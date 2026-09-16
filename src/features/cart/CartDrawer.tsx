import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeCart, selectCartTotalCount } from './cartSlice';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import CartItemRow from './CartItemRow';
import CartSummary from './CartSummary';
import { clearCart } from './cartSlice';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, items } = useAppSelector(state => state.cart);
  const totalCount = useAppSelector(selectCartTotalCount);

  // Đóng bằng Escape + khoá scroll nền khi mở — chuẩn UX drawer
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeCart());
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, dispatch]);

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={() => dispatch(closeCart())}
        aria-hidden={!isOpen}
      />
      <aside
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Giỏ hàng"
      >
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={24} />
            <h2>Giỏ hàng {totalCount > 0 && <span className="cart-count">({totalCount})</span>}</h2>
          </div>
          <div className="cart-header-actions">
            {items.length > 0 && (
              <button
                className="clear-cart-btn"
                onClick={() => dispatch(clearCart())}
                title="Xoá toàn bộ giỏ"
              >
                <Trash2 size={16} />
                Xoá hết
              </button>
            )}
            <button className="close-btn" aria-label="Đóng giỏ hàng" onClick={() => dispatch(closeCart())}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={64} className="empty-icon" />
              <p>Giỏ hàng đang trống.</p>
              <button className="continue-shopping" onClick={() => dispatch(closeCart())}>
                Tiếp tục mua sắm <ArrowRight size={16} />
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
      </aside>
    </>
  );
};

export default CartDrawer;

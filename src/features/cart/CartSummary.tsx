import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { 
  selectCartSubtotal, 
  selectCartTotalAmount, 
  applyDiscount,
  clearCart,
  closeCart
} from './cartSlice';

const CartSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotalAmount);
  const { discountCode, discountPercent } = useAppSelector(state => state.cart);
  
  const [codeInput, setCodeInput] = useState('');

  const handleApplyDiscount = () => {
    dispatch(applyDiscount(codeInput));
  };

  const handleCheckout = () => {
    alert(`Thanh toán thành công $${total.toFixed(2)}! Cảm ơn bạn.`);
    dispatch(clearCart());
    dispatch(closeCart());
  };

  return (
    <div className="cart-summary">
      <div className="discount-section">
        <input 
          type="text" 
          placeholder="Mã giảm giá (VD: LTWNC2026)" 
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />
        <button onClick={handleApplyDiscount}>Áp dụng</button>
      </div>

      {discountCode && discountPercent > 0 && (
        <div className="discount-success">
          Đã áp dụng mã <strong>{discountCode}</strong> giảm {discountPercent}%
        </div>
      )}

      <div className="summary-row">
        <span>Tạm tính:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      
      {discountPercent > 0 && (
        <div className="summary-row discount">
          <span>Giảm giá ({discountPercent}%):</span>
          <span>-${(subtotal * discountPercent / 100).toFixed(2)}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>Tổng cộng:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        Thanh toán
      </button>
    </div>
  );
};

export default CartSummary;

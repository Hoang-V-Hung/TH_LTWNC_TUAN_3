import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectCartSubtotal,
  selectCartTotalAmount,
  selectCartTotalCount,
  applyDiscount,
  clearDiscountError,
  checkoutSuccess,
  closeCart
} from './cartSlice';
import { decreaseStock } from '../products/productsSlice';
import { productsApi } from '../products/productsApi';
import { formatVND } from '../../utils/format';
import { BadgePercent, CircleCheck, CircleAlert } from 'lucide-react';

const CartSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotalAmount);
  const totalCount = useAppSelector(selectCartTotalCount);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { discountCode, discountPercent, discountError } = useAppSelector(state => state.cart);

  const [codeInput, setCodeInput] = useState('');
  const [paid, setPaid] = useState(false);

  const handleApplyDiscount = () => {
    setPaid(false);
    dispatch(applyDiscount(codeInput));
  };

  const handleCheckout = () => {
    // Chốt số liệu TRƯỚC khi xoá giỏ để toast hiển thị đúng tổng tiền,
    // đồng thời trừ tồn kho ở BOTH nguồn dữ liệu:
    // - productsSlice (chế độ AsyncThunk)
    // - RTK Query cache (chế độ RTK Query)
    const purchases = cartItems.map((i) => ({ id: i.id, quantity: i.quantity }));
    const message = `Thanh toán thành công ${formatVND(total)} cho ${totalCount} món! Cảm ơn bạn.`;
    dispatch(decreaseStock(purchases));
    dispatch(
      productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
        for (const p of purchases) {
          const prod = draft.find((d) => d.id === p.id);
          if (prod) prod.stock = Math.max(0, prod.stock - p.quantity);
        }
      })
    );
    dispatch(checkoutSuccess(message));
    setPaid(true);
  };

  const handleCloseAfterPaid = () => {
    setPaid(false);
    dispatch(closeCart());
  };

  if (paid) {
    return (
      <div className="cart-summary">
        <div className="checkout-success">
          <CircleCheck size={40} />
          <h3>Đặt hàng thành công!</h3>
          <p>Cảm ơn bạn đã mua sắm tại LTWNC Store.</p>
          <button className="checkout-btn" onClick={handleCloseAfterPaid}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="discount-section">
        <input
          type="text"
          placeholder="Mã giảm giá (VD: LTWNC2026)"
          value={codeInput}
          onChange={(e) => {
            setCodeInput(e.target.value);
            if (discountError) dispatch(clearDiscountError());
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApplyDiscount();
          }}
          aria-label="Mã giảm giá"
        />
        <button onClick={handleApplyDiscount}>Áp dụng</button>
      </div>

      {discountError && (
        <div className="discount-error" role="alert">
          <CircleAlert size={16} /> {discountError}
        </div>
      )}

      {discountCode && discountPercent > 0 && (
        <div className="discount-success">
          <BadgePercent size={16} /> Đã áp dụng mã <strong>{discountCode}</strong> giảm {discountPercent}%
        </div>
      )}

      <div className="summary-row">
        <span>Tạm tính ({totalCount} món):</span>
        <span>{formatVND(subtotal)}</span>
      </div>

      {discountPercent > 0 && (
        <div className="summary-row discount">
          <span>Giảm giá ({discountPercent}%):</span>
          <span>-{formatVND(subtotal * discountPercent / 100)}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>Tổng cộng:</span>
        <span>{formatVND(total)}</span>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        Thanh toán · {formatVND(total)}
      </button>
    </div>
  );
};

export default CartSummary;

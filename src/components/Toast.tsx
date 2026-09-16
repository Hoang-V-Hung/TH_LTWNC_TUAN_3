import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { dismissWarning, dismissSuccess } from '../features/cart/cartSlice';
import { TriangleAlert, CircleCheck, X } from 'lucide-react';

/** Toast toàn cục: cảnh báo tồn kho (vàng/đen) + thanh toán thành công (xanh). */
const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const warning = useAppSelector((state) => state.cart.lastWarning);
  const success = useAppSelector((state) => state.cart.lastSuccess);

  useEffect(() => {
    if (!warning) return;
    const t = setTimeout(() => dispatch(dismissWarning()), 3500);
    return () => clearTimeout(t);
  }, [warning, dispatch]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => dispatch(dismissSuccess()), 4500);
    return () => clearTimeout(t);
  }, [success, dispatch]);

  if (!warning && !success) return null;

  return (
    <div className="toast-stack">
      {success && (
        <div className="toast success" role="status">
          <CircleCheck size={18} />
          <span>{success}</span>
          <button
            className="toast-close"
            aria-label="Đóng thông báo thành công"
            onClick={() => dispatch(dismissSuccess())}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {warning && (
        <div className="toast" role="alert">
          <TriangleAlert size={18} />
          <span>{warning}</span>
          <button
            className="toast-close"
            aria-label="Đóng thông báo"
            onClick={() => dispatch(dismissWarning())}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;

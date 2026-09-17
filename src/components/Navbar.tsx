import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { openCart, selectCartTotalCount } from '../features/cart/cartSlice';
import { ShoppingCart, Store } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const totalCount = useAppSelector(selectCartTotalCount);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Store className="logo-icon" size={28} />
          <h1>LTWNC Store</h1>
        </div>

        <div className="navbar-controls">


          <button className="cart-trigger-btn" onClick={() => dispatch(openCart())}>
            <ShoppingCart size={24} />
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

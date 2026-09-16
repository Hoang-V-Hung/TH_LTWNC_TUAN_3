import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { openCart, selectCartTotalCount } from '../features/cart/cartSlice';
import { ShoppingCart, Store } from 'lucide-react';

interface Props {
  useRtkQuery: boolean;
  setUseRtkQuery: (value: boolean) => void;
}

const Navbar: React.FC<Props> = ({ useRtkQuery, setUseRtkQuery }) => {
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
          <div className="toggle-container">
            <span className={!useRtkQuery ? 'active' : ''}>AsyncThunk</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={useRtkQuery}
                onChange={(e) => setUseRtkQuery(e.target.checked)} 
              />
              <span className="slider round"></span>
            </label>
            <span className={useRtkQuery ? 'active' : ''}>RTK Query</span>
          </div>

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

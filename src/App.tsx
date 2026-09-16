import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './features/products/ProductList';
import CartDrawer from './features/cart/CartDrawer';

const App: React.FC = () => {
  // Trạng thái để switch giữa thunk và rtk query
  const [useRtkQuery, setUseRtkQuery] = useState(false);

  return (
    <div className="app-layout">
      <Navbar useRtkQuery={useRtkQuery} setUseRtkQuery={setUseRtkQuery} />
      
      <main className="app-container">
        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Sản phẩm nổi bật
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Đang sử dụng dữ liệu từ: <strong>{useRtkQuery ? 'RTK Query (productsApi)' : 'createAsyncThunk (fetchProducts)'}</strong>
          </p>
        </header>

        <ProductList useRtkQuery={useRtkQuery} />
      </main>

      <CartDrawer />
    </div>
  );
};

export default App;

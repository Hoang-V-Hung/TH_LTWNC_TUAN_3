import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProductList from './features/products/ProductList';
import CartDrawer from './features/cart/CartDrawer';
import { Truck, ShieldCheck, BadgePercent } from 'lucide-react';

const App: React.FC = () => {
  // Trạng thái để switch giữa thunk và rtk query
  const [useRtkQuery, setUseRtkQuery] = useState(false);

  return (
    <div className="app-layout">
      <Navbar useRtkQuery={useRtkQuery} setUseRtkQuery={setUseRtkQuery} />

      <main className="app-container">
        <header className="hero-banner">
          <div>
            <h2>Sản phẩm nổi bật</h2>
            <p>
              Đang sử dụng dữ liệu từ:{' '}
              <strong>{useRtkQuery ? 'RTK Query (productsApi → FakeStoreAPI)' : 'createAsyncThunk (fetchProducts)'}</strong>
            </p>
          </div>
          <div className="hero-perks">
            <span><Truck size={16} /> Freeship đơn từ 500K</span>
            <span><ShieldCheck size={16} /> Đổi trả 30 ngày</span>
            <span><BadgePercent size={16} /> Mã LTWNC2026 −15%</span>
          </div>
        </header>

        <ProductList useRtkQuery={useRtkQuery} />
      </main>

      <CartDrawer />
      <Toast />
    </div>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from 'react-router';
import DefaultLayout from './layouts/DefaultLayout';
import HomePage from './pages/home';
import ProductPage from './pages/product';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Route>
        <Route path="*" element={<p className="p-8">Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

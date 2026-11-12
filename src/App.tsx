import { BrowserRouter, Route, Routes } from 'react-router';
import DefaultLayout from './layouts/DefaultLayout';
import HomePage from './pages/home';
import ProductPage from './pages/shop/[categorySlug]/[collectionSlug]/[productSlug]';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop/:categorySlug/:collectionSlug/:productSlug" element={<ProductPage />} />
        </Route>
        <Route path="*" element={<p className="p-8">Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

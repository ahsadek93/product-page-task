import { BrowserRouter, Route, Routes } from 'react-router';
import DefaultLayout from './layouts/DefaultLayout';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import ProductPage from './pages/shop/[categorySlug]/[collectionSlug]/[productSlug]';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop/:categorySlug/:collectionSlug/:productSlug" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Outlet } from 'react-router';
import AnnouncementBar from './announcement-bar/AnnouncementBar';
import AppHeader from './header/AppHeader';
import AppFooter from './footer/AppFooter';
import CartDrawer from '@/features/cart/components/cart-drawer/CartDrawer';
import CartToast from '@/features/cart/components/cart-toast/CartToast';

function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
      <CartDrawer />
      <CartToast />
    </div>
  );
}

export default DefaultLayout;

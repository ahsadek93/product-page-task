import { Outlet } from 'react-router';
import AppHeader from './header/AppHeader';
import AppFooter from './footer/AppFooter';

function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default DefaultLayout;

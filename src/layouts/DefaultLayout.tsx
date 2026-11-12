import { Outlet } from 'react-router';
import AnnouncementBar from './announcement-bar/AnnouncementBar';
import AppHeader from './header/AppHeader';
import AppFooter from './footer/AppFooter';

function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default DefaultLayout;

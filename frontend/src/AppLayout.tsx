import { Outlet } from 'react-router-dom';
import './AppLayout.scss';
import { Nav } from './components';

export const AppLayout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

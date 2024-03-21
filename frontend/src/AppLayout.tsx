import { Outlet } from 'react-router-dom';
import './AppLayout.scss';
import { Nav } from './components';

export const AppLayout = () => {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
};

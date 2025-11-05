import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

/**
 * Layout Component
 * Main layout wrapper with header and content area
 */
export const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} React JWT Auth. Built with React,
          Axios, React Query, and React Hook Form.
        </p>
      </footer>
    </div>
  );
};

export default Layout;

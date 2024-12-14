import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route location

  // Map routes to human-readable names
  const routeNames = {
    '/admin/dashboard/books': 'Books',
    '/admin/dashboard/authors': 'Authors',
    '/admin/dashboard/awards': 'Awards',
    '/admin/dashboard': 'Dashboard',
  };

  // Determine the active route name based on the location
  const activePage = routeNames[location.pathname] || 'Admin Panel';

  const handleLogout = () => {
    Cookies.remove('authToken'); // Remove authentication token
    navigate('/auth'); // Redirect to the login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div className="container-fluid">
        <span className="navbar-brand">{activePage}</span> {/* Show active page */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className={`nav-item ${location.pathname === '/admin/dashboard/books' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin/dashboard/books">
                Books
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/dashboard/authors' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin/dashboard/authors">
                Authors
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/dashboard/awards' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin/dashboard/awards">
                Awards
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/dashboard/warehouses' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin/dashboard/warehouses">
                Warehouses
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/dashboard/contains' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin/dashboard/contains">
                Contains
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/dashboard/inventories' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin/dashboard/inventories">
                Inventories
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;

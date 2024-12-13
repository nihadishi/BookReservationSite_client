import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Fix import

const Header = () => {
  const token = Cookies.get('authToken');
  let userName = 'Guest';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.name || 'Guest';
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userName');
    window.location.href = '/auth';
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white vh-100 position-fixed"
      style={{ width: '250px', left: 0, top: 0 }}
    >
      {/* User Name Section */}
      <div className="mb-4 mt-3 text-center">
        <h3>{userName}</h3>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link text-white">
              Home
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/search" className="nav-link text-white">
              Search
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/basket" className="nav-link text-white">
              Basket
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/reservations" className="nav-link text-white">
              Reservations
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="btn btn-danger w-100">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;

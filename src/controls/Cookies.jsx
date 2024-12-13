import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CookiesCheck = ({ children }) => {
  const authToken = Cookies.get('authToken');
  if (!authToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default CookiesCheck;

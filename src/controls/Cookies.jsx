import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const CookiesCheck = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const authToken = Cookies.get('authToken');
      if (!authToken) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.post(
          '/auth/checkToken',
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status === 200 && response.data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default CookiesCheck;

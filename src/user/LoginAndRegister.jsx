import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginAndRegister = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '',phone:'',address:''});
  const navigate = useNavigate()
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.post('/auth/login', loginData);
    const token = response.data.token;
    console.log(response);
    Cookies.set('authToken', token, { expires: 7, secure: true });
    navigate('/')

  } catch (error) {
    console.log(error);
    
  }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', registerData);
      alert('Registration successful! Please log in.');
      window.location.reload();
    } catch (error) {
      console.log(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <div className="container mt-5">
      <div className="slider-container position-relative overflow-hidden" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div
          className="slider-content d-flex transition-all"
          style={{
            transform: `translateX(${isLoginActive ? '0%' : '-50%'})`,
            width: '200%',
            transition: 'transform 0.6s ease',
          }}
        >
          {/* Login */}
          <div className="form-section w-50 p-4 ">
            <h4 className="text-center text-primary">Login</h4>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
                <label htmlFor="loginEmail">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <label htmlFor="loginPassword">Password</label>
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <p className="text-center mt-3">
              Don't have an account?{' '}
              <span className="text-primary" style={{ cursor: 'pointer' }} onClick={toggleForm}>
                Register here
              </span>
            </p>
          </div>

          {/* Register Form */}
          <div className="form-section w-50 p-4 ">
            <h4 className="text-center text-success">Register</h4>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="registerName"
                  name="name"
                  placeholder="Enter your full name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                />
                <label htmlFor="registerName">Full Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="registerPhone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                />
                <label htmlFor="registerName">Phone Number (010-xxxx-xxxx)</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="registerAddress"
                  name="address"
                  placeholder="Enter your address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                />
                <label htmlFor="registerName">Address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  name="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                />
                <label htmlFor="registerEmail">Email</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  name="password"
                  placeholder="Enter your password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                />
                <label htmlFor="registerPassword">Password</label>
              </div>
            
              <button type="submit" className="btn btn-success w-100">Register</button>
            </form>
            <p className="text-center mt-3">
              Already have an account?{' '}
              <span className="text-success" style={{ cursor: 'pointer' }} onClick={toggleForm}>
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;

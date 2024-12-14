import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginAndRegister from './user/LoginAndRegister';
import Home from './user/Home';
import Basket from './user/Basket';
import './App.css';
import axios from 'axios';
import Reservation from './user/Reservation';
import Search from './user/Search';
import Detail from './user/Detail';
import AdminLogin from './admin/Login';

axios.defaults.baseURL = 'http://localhost:2021';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginAndRegister />} />
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Home />} />
        <Route path="/books/:id" element={<Detail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/reservations" element={<Reservation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin" element={<AdminLogin />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

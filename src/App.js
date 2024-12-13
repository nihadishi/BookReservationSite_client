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

axios.defaults.baseURL = 'http://localhost:3030';
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
      </Routes>
    </Router>
  );
}

export default App;

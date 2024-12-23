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
import AdminDashboard from './admin/Dashboard';
import AdminBooks from './admin/Books';
import AdminAuthors from './admin/Authors';
import AdminAwards from './admin/Awards';
import AdminWarehouses from './admin/Warehouses';
import AdminContains from './admin/Contains';
import AdminInventories from './admin/Inventories';

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
        <Route path="/admin/dashboard/" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/books" element={<AdminBooks />} />
        <Route path="/admin/dashboard/authors" element={<AdminAuthors />} />
        <Route path="/admin/dashboard/awards" element={<AdminAwards />} />
        <Route path="/admin/dashboard/warehouses" element={<AdminWarehouses />} />
        <Route path="/admin/dashboard/contains" element={<AdminContains />} />
        <Route path="/admin/dashboard/inventories" element={<AdminInventories />} />
      </Routes>
    </Router>
  );
}

export default App;

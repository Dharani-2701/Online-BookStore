
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginSignup/Login';
import Signup from './components/LoginSignup/Signup';
import Home from './components/LoginSignup/Home';
import Dashboard from './components/LoginSignup/DashB/Dashboard';
import Cart from './components/LoginSignup/cart/cart';
import Wishlistpage from './components/LoginSignup/wish-list/wishlist';
import BookDetails from './components/LoginSignup/bookdetail/bookdetail';
import AccountPage from './components/LoginSignup/user-account/accountpage';
import Admin from './components/LoginSignup/admin/admin';
import Editbook from './components/LoginSignup/edit-book/editbook';
import AddBook from './components/LoginSignup/addbook/addbook';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/cart-page" element={<Cart/>} />
        <Route path="/wishlist-page" element={<Wishlistpage />} />
        <Route path='/book/:id' element={<BookDetails/>} />
        <Route path='/account' element={<AccountPage/>} />
        <Route path='/admin-dashboard' element={< Admin />} />
        <Route path='/edit-book-page/:id' element={<Editbook/>} />
        <Route path='/add-book-page' element={<AddBook/>} />
      </Routes>
    </Router>
  );
}

export default App;

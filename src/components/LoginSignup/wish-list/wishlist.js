import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './wishlist.css';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { faCartShopping, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://bookstore-api-o0xo.onrender.com/wishlist')
      .then(res => res.json())
      .then(data => setWishlistItems(data))
      .catch(err => console.error(err));
  }, []);

  const handleSignoutIconClick = () => navigate('/');
  const handleCartIconClick = () => navigate('/cart-page', { state: { cartItems: cart } });
  const handleProfileIconClick = () => navigate('/account');

  const handleAddToCart = (book) => {
    if (book.stock > 0) {
      fetch('https://bookstore-api-o0xo.onrender.com/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...book, quantity: 1 })
      })
        .then(res => res.json())
        .then(() => setCart(prev => [...prev, { ...book, quantity: 1 }]))
        .catch(err => console.error(err));
    } else {
      alert('This book is out of stock and cannot be added to the cart.');
    }
  };

  const handleToggleWishlist = (book) => {
    const exists = wishlistItems.some(w => w.id === book.id);
    if (exists) {
      fetch(`https://bookstore-api-o0xo.onrender.com/wishlist/${book.id}`, { method: 'DELETE' })
        .then(() => setWishlistItems(prev => prev.filter(w => w.id !== book.id)))
        .catch(err => console.error(err));
    } else {
      fetch('https://bookstore-api-o0xo.onrender.com/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      })
        .then(res => res.json())
        .then(data => setWishlistItems(prev => [...prev, data]))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className='wishlist-page'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='search-box'>
          <input type='text' placeholder='Search' />
          <img src={search_light} alt='search icon' />
        </div>
        <div className='icons'>
          <FontAwesomeIcon icon={faUser} className='profile-icon' onClick={handleProfileIconClick} />
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' onClick={handleCartIconClick} />
          <FontAwesomeIcon icon={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />
        </div>
      </div>

      <h1>Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <div className='wishlist-items'>
          {wishlistItems.map(item => (
            <div key={item.id} className='wishlist-item'>
              <img src={item.imageUrl} alt={item.name} className='wishlist-item-image' />
              <div className='wishlist-item-details'>
                <h2>{item.name}</h2>
                <p>{item.author}</p>
                <p>{`₹${item.price}`}</p>
                <button
                  className='add-to-cart'
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock <= 0}
                >
                  Add to Cart
                </button>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`wishlist-icon ${wishlistItems.some(w => w.id === item.id) ? 'in-wishlist' : ''}`}
                  onClick={() => handleToggleWishlist(item)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistPage;

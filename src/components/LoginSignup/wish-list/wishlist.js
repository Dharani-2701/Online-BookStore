import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './wishlist.css';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [newBook, setNewBook] = useState({
    name: '',
    author: '',
    price: '',
    imageUrl: '',
    stock: 1
  });
  const handleSignoutIconClick = () => {
    navigate('/');
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch wishlist data from backend
    fetch('http://localhost:5000/wishlist')
      .then(response => response.json())
      .then(data => setWishlistItems(data))
      .catch(error => console.error('Error fetching wishlist:', error));
  }, []);

  const handleCartIconClick = () => {
    navigate('/cart-page', { state: { cartItems: cart } });
  };

  const handleProfileIconClick = () => {
    const loggedInUser = { /* fetch the user details based on login */ };
    navigate('/account', { state: { user: loggedInUser } });
  };

  const handleAddToCart = (book) => {
    if (book.stock > 0) {
      fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...book, quantity: 1 })
      })
      .then(response => response.json())
      .then(() => {
        // Optionally update local state or handle success
        setCart(prevCart => [...prevCart, { ...book, quantity: 1 }]);
      })
      .catch(error => console.error('Error adding item to cart:', error));
    } else {
      alert('This book is out of stock and cannot be added to the cart.');
    }
  };

  const handleRemoveFromWishlist = (itemId) => {
    fetch(`http://localhost:5000/wishlist/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => setWishlistItems(prevWishlistItems => prevWishlistItems.filter(item => item.id !== itemId)))
      .catch(error => console.error('Error removing item from wishlist:', error));
  };

  const handleAddBook = () => {
    // Post new book details to the backend
    fetch('http://localhost:5000/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then(response => response.json())
      .then(data => {
        setWishlistItems(prevWishlistItems => [...prevWishlistItems, data]);
        setNewBook({
          name: '',
          author: '',
          price: '',
          imageUrl: '',
          stock: 1
        });
      })
      .catch(error => console.error('Error adding book to wishlist:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prevBook => ({
      ...prevBook,
      [name]: value,
    }));
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
          <FontAwesomeIcon icon ={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />

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
                <button 
                  className='remove-from-wishlist'
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  Remove from Wishlist
                </button>
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

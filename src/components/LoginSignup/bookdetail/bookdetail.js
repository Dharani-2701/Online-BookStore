import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import booksDataFromJson from '../../../db.json';
import './bookdetail.css'; 
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Log id and data for debugging
  console.log('Book ID from URL:', id);
  console.log('Books data:', booksDataFromJson.books);

  // Find the book using string comparison
  const book = booksDataFromJson.books.find(book => book.id === id);

  // Log found book
  console.log('Found book:', book);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const handleAddToCart = (book) => {
    if (book.stock > 0) {
      setCart(prevCart => [...prevCart, { ...book, quantity: 1 }]);
    } else {
      alert('This book is out of stock and cannot be added to the cart.');
    }
  };

  const handleAddToWishlist = (book) => {
    if (!wishlist.some(wishlistItem => wishlistItem.id === book.id)) {
      setWishlist(prevWishlist => [...prevWishlist, book]);
    }
  };

  const handleCartIconClick = () => {
    const serializableCart = cart.map(item => ({ ...item }));
    navigate('/cart-page', { state: { cartItems: serializableCart } });
  };

  const handleWishlistIconClick = () => {
    const serializableWishlist = wishlist.map(item => ({ ...item }));
    navigate('/wishlist-page', { state: { wishlistItems: serializableWishlist } });
  };

  const handleProfileIconClick = () => {
    navigate('/profile-page');
  };

  return (
    <div className='bookdetail-container'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='search-box'>
          <input 
            type='text' 
            placeholder='Search by book'
          />
          <img src={search_light} alt='search icon' />
        </div>
        <div className='icons'>
          <FontAwesomeIcon icon={faHeart} className='wishlist' onClick={handleWishlistIconClick} />
          <FontAwesomeIcon icon={faUser} className='profile-icon' onClick={handleProfileIconClick} />
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' onClick={handleCartIconClick} />
        </div>
      </div>

      <div className="book-details">
        {book ? (
          <>
            <img src={book.imageUrl} alt={book.name} className="book-image" />
            <div className="book-info">
              <h1>{book.name}</h1>
              <h2>{book.author}</h2>
              <p>{book.description}</p>
              <div className="book-price">{`₹${book.price}`}</div>
              <div className={`book-stock ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
              <button 
                className="add-to-cart"
                onClick={() => handleAddToCart(book)}
                disabled={book.stock <= 0}
              >
                Add to Cart
              </button>
              <FontAwesomeIcon
                icon={faHeart}
                className='wishlist-icon'
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(book);
                }}
              />
              <button onClick={() => navigate(-1)}>Back</button>
            </div>
          </>
        ) : (
          <p>Book not found</p>
        )}
      </div>
    </div>
  );
};

export default BookDetails;

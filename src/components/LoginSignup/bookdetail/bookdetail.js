import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './bookdetail.css';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch(`https://bookstore-api-o0xo.onrender.com/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error(err));

    fetch('https://bookstore-api-o0xo.onrender.com/wishlist')
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (book.stock > 0) {
      fetch('https://bookstore-api-o0xo.onrender.com/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...book, quantity: 1 })
      })
        .then(res => res.json())
        .then(() => setCart(prev => [...prev, { ...book, quantity: 1 }]))
        .catch(err => console.error(err));
    } else alert('Out of stock');
  };

  const handleToggleWishlist = () => {
    if (!book) return;
    const exists = wishlist.some(w => w.id === book.id);
    if (exists) {
      fetch(`https://bookstore-api-o0xo.onrender.com/wishlist/${book.id}`, { method: 'DELETE' })
        .then(() => setWishlist(prev => prev.filter(w => w.id !== book.id)))
        .catch(err => console.error(err));
    } else {
      fetch('https://bookstore-api-o0xo.onrender.com/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      })
        .then(res => res.json())
        .then(data => setWishlist(prev => [...prev, data]))
        .catch(err => console.error(err));
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className='bookdetail-container'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='search-box'>
          <input type='text' placeholder='Search by book' />
          <img src={search_light} alt='search icon' />
        </div>
        <div className='icons'>
          <FontAwesomeIcon icon={faHeart} className={`wishlist-icon ${wishlist.some(w => w.id === book.id) ? 'in-wishlist' : ''}`} onClick={handleToggleWishlist} />
          <FontAwesomeIcon icon={faUser} className='profile-icon' onClick={() => navigate('/profile-page')} />
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' onClick={() => navigate('/cart-page', { state: { cartItems: cart } })} />
        </div>
      </div>

      <div className='book-details'>
        <img src={book.imageUrl} alt={book.name} className='book-image' />
        <div className='book-info'>
          <h1>{book.name}</h1>
          <h2>{book.author}</h2>
          <p>{book.description}</p>
          <div className='book-price'>{`₹${book.price}`}</div>
          <div className={`book-stock ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>{book.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
          <button className='add-to-cart' onClick={handleAddToCart} disabled={book.stock <= 0}>Add to Cart</button>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

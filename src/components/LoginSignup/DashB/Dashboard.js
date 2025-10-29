import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [booksData, setBooksData] = useState([]);
  const [authorInput, setAuthorInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://bookstore-api-o0xo.onrender.com/books")
      .then(res => res.json())
      .then(data => setBooksData(data))
      .catch(err => console.error(err));

    fetch("https://bookstore-api-o0xo.onrender.com/wishlist")
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(err => console.error(err));
  }, []);

  const uniqueTypes = [...new Set(booksData.map(book => book.type))];
  const priceRanges = [
    { label: 'Under ₹100', value: '100' },
    { label: '₹100-₹500', value: '500' },
    { label: 'Above ₹500', value: '501' },
  ];

  const handleAuthorInputChange = e => setAuthorInput(e.target.value);
  const handleSearchInputChange = e => setSearchInput(e.target.value);
  const handlePriceChange = price => {
    setSelectedPrices(prev => prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]);
  };
  const handleTypeChange = type => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

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

  const filteredBooks = booksData.filter(book => {
    const matchesTitle = searchInput ? book.name.toLowerCase().includes(searchInput.toLowerCase()) : true;
    const matchesAuthor = authorInput ? book.author.toLowerCase().includes(authorInput.toLowerCase()) : true;
    const matchesPrice = selectedPrices.length ? selectedPrices.some(price => {
      if (price === '100') return book.price <= 100;
      if (price === '500') return book.price > 100 && book.price <= 500;
      if (price === '501') return book.price > 500;
      return true;
    }) : true;
    const matchesType = selectedTypes.length ? selectedTypes.includes(book.type) : true;
    return matchesTitle && matchesAuthor && matchesPrice && matchesType;
  });

  return (
    <div className='dashboard'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='search-box'>
          <input type='text' value={searchInput} onChange={handleSearchInputChange} placeholder='Search by book' />
          <img src={search_light} alt='search icon' />
        </div>
        <div className='icons'>
          <FontAwesomeIcon icon={faHeart} className='wishlist-icon' onClick={() => navigate('/wishlist-page')} />
          <FontAwesomeIcon icon={faUser} className='profile-icon' onClick={handleProfileIconClick} />
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' onClick={handleCartIconClick} />
          <FontAwesomeIcon icon={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />
        </div>
      </div>

      <div className='content'>
        <div className='filter-section'>
          <h3>Filter by Author</h3>
          <input type='text' value={authorInput} onChange={handleAuthorInputChange} placeholder='Enter author name' />
          <h3>Filter by Price</h3>
          {priceRanges.map(price => (
            <div key={price.value}>
              <input type='checkbox' checked={selectedPrices.includes(price.value)} onChange={() => handlePriceChange(price.value)} />
              <label>{price.label}</label>
            </div>
          ))}
          <h3>Filter by Type</h3>
          {uniqueTypes.map(type => (
            <div key={type}>
              <input type='checkbox' checked={selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} />
              <label>{type}</label>
            </div>
          ))}
        </div>

        <div className='bookstore'>
          {filteredBooks.map(book => (
            <div key={book.id} className='book-card'>
              <img src={book.imageUrl} alt={book.name} className='book-image' onClick={() => navigate(`/book/${book.id}`)} />
              <div className='book-details'>
                <div className='book-title'>{book.name}</div>
                <div className='book-author'>{book.author}</div>
                <div className='book-price'>{`₹${book.price}`}</div>
                <div className={`book-stock ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <button className='add-to-cart' onClick={() => handleAddToCart(book)} disabled={book.stock <= 0}>Add to Cart</button>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`wishlist-icon ${wishlist.some(w => w.id === book.id) ? 'in-wishlist' : ''}`}
                  onClick={() => handleToggleWishlist(book)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../DashB/Dashboard.css';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import booksDataFromJson from '../../../db.json';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const [booksData] = useState(booksDataFromJson.books);
  const [authorInput, setAuthorInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  const uniqueTypes = [...new Set(booksData.map(book => book.type))];
  const priceRanges = [
    { label: 'Under ₹100', value: '100' },
    { label: '₹100-₹500', value: '500' },
    { label: 'Above ₹500', value: '501' },
  ];

  const handleAuthorInputChange = (event) => {
    setAuthorInput(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  }

  const handlePriceChange = (price) => {
    setSelectedPrices(prevState =>
      prevState.includes(price) ? prevState.filter(p => p !== price) : [...prevState, price]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prevState =>
      prevState.includes(type) ? prevState.filter(t => t !== type) : [...prevState, type]
    );
  };

  const handleAddToCart = (book) => {
  const isAlreadyInCart = cart.some(cartItem => cartItem.id === book.id);

  if (isAlreadyInCart) {
    alert('This book is already in the cart!');
    return;
  }

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
      setCart(prevCart => [...prevCart, { ...book, quantity: 1 }]);
      alert('Added to cart successfully!');
    })
    .catch(error => console.error('Error adding item to cart:', error));
  } else {
    alert('This book is out of stock and cannot be added to the cart.');
  }
};

  

  const handleAddToWishlist = (book) => {
  const isAlreadyInWishlist = wishlist.some(wishlistItem => wishlistItem.id === book.id);

  if (isAlreadyInWishlist) {
    alert('This book is already in the wishlist!');
    return;
  }

  if (book.stock <= 0) {
    const confirmAdd = window.confirm('This book is out of stock. Would you like to add it to your wishlist to be notified when it becomes available?');
    if (!confirmAdd) {
      return;
    }
  }

  fetch('http://localhost:5000/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
  .then(response => response.json())
  .then(() => {
    setWishlist(prevWishlist => [...prevWishlist, book]);
    alert('Book added to wishlist successfully!');
  })
  .catch(error => console.error('Error adding item to wishlist:', error));
};

  

  const handleCartIconClick = () => {
    const serializableCart = cart.map(item => ({ ...item })); 
    navigate('/cart-page', { state: { cartItems: serializableCart } });
  };

  const handleWishlistIconClick = () => {
    const serializableWishlist = wishlist.map(item => ({ ...item }));
    navigate('/wishlist-page', { state: { wishlistItems: serializableWishlist } });
  };

  const handleSignoutIconClick = () => {
    navigate('/');
  };
  

  const handleProfileIconClick = () => {
    const loggedInUser = { /* fetch the user details based on login */ };
    navigate('/account', { state: { user: loggedInUser } });
  };

  const filteredBooks = booksData.filter(book => {
    const matchesTitle = searchInput.length ? book.name.toLowerCase().includes(searchInput.toLowerCase()) : true;
    const matchesAuthor = authorInput.length ? book.author.toLowerCase().includes(authorInput.toLowerCase()) : true;
    const matchesPrice = selectedPrices.length ? selectedPrices.some(price => {
      if (price === '100') return book.price <= 100;
      if (price === '500') return book.price > 100 && book.price <= 500;
      if (price === '501') return book.price > 500;
      return true;
    }) : true;
    const matchesType = selectedTypes.length ? selectedTypes.includes(book.type) : true;
    return matchesTitle && matchesAuthor && matchesPrice && matchesType;
  });

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className='dashboard'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='search-box'>
          <input 
            type='text' 
            value={searchInput} 
            onChange={handleSearchInputChange} 
            placeholder='Search by book'
          />
          <img src={search_light} alt='search icon' />
        </div>
        <div className='icons'>
          <FontAwesomeIcon icon={faHeart} className='wishlist' onClick={handleWishlistIconClick} />
          <FontAwesomeIcon icon={faUser} className='profile-icon' onClick={handleProfileIconClick} />
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' onClick={handleCartIconClick} />
          <FontAwesomeIcon icon ={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />
        </div>
      </div>

      <div className='content'>
        <div className='filter-section'>
          <h3>Filter by Author</h3>
          <input 
            type='text'
            value={authorInput}
            onChange={handleAuthorInputChange}
            placeholder='Enter author name'
          />

          <h3>Filter by Price</h3>
          {priceRanges.map(price => (
            <div key={price.value}>
              <input
                type='checkbox'
                checked={selectedPrices.includes(price.value)}
                onChange={() => handlePriceChange(price.value)}
              />
              <label>{price.label}</label>
            </div>
          ))}

          <h3>Filter by Type</h3>
          {uniqueTypes.map(type => (
            <div key={type}>
              <input
                type='checkbox'
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              <label>{type}</label>
            </div>
          ))}
        </div>

        <div className='bookstore'>
          {filteredBooks.map(book => (
            <div key={book.id} className='book-card' onClick={() => handleBookClick(book.id)}>
              <img src={book.imageUrl} alt={book.name} className='book-image' />
              <div className='book-details'>
                <div className='book-title'>{book.name}</div>
                <div className='book-author'>{book.author}</div>
                <div className='book-price'>{`₹${book.price}`}</div>
                <div className={`book-stock ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <button 
                  className='add-to-cart'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(book);
                  }}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

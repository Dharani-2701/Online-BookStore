import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSignOutAlt, faBook, faTrash } from '@fortawesome/free-solid-svg-icons';
import booksDataFromJson from '../../../db.json';

const Dashboard = () => {
  const [booksData] = useState(booksDataFromJson.books);
  const [authorInput, setAuthorInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

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
  };

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

  const handleSignoutIconClick = () => {
    navigate('/');
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

  const handleAddBook = () => {
    navigate(`/add-book-page`);
  };

  const handleEditBook = (book) => {
    navigate(`/edit-book-page/${book.id}`);
  };

  const handleDeleteBook = (bookId) => {
    fetch(`http://localhost:5000/books/${bookId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // Reload the books data after deletion
        // Optionally, you can re-fetch the books or filter out the deleted book
        alert('Book deleted successfully');
        window.location.reload();
      } else {
        throw new Error('Failed to delete book');
      }
    })
    .catch(error => console.error('Error deleting book:', error));
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
          <FontAwesomeIcon icon={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />
          <FontAwesomeIcon icon={faBook} className='add-book-icon' onClick={handleAddBook} />
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
                  {book.stock > 0 
                    ? `In Stock: ${book.stock}`
                    : 'Out of Stock'}
                </div>
              </div>
              <button 
                className='edit-book'
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditBook(book);
                }}>
                Edit Book
              </button>
              <FontAwesomeIcon icon={faTrash}
                className='delete'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBook(book.id);
                }}>
                Delete Book
              </FontAwesomeIcon>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

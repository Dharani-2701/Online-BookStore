import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addbook.css';
import logoo from '../../assests/logoo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBook } from '@fortawesome/free-solid-svg-icons';

const AddBook = () => {
  const [bookData, setBookData] = useState({
    name: '',
    author: '',
    price: '',
    stock: '',
    category: '',
    type: '',
    description: '',
    imageUrl: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    })
    .then(res => res.json())
    .then(() => {
      alert("Book added successfully!");
      navigate('/admin-dashboard');
    })
    .catch(err => console.error("Error adding book:", err));
  };

  const handleSignoutIconClick = () => {
    navigate('/');
  };

  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className='addbook-container'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='addbook-title'>Add Book</div>
        <div className='icons'>
          <FontAwesomeIcon icon={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />
          <FontAwesomeIcon icon={faBook} className='add-book-icon' onClick={handleBackToDashboard} />
        </div>
      </div>

      <form className="addbook-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Book Name" value={bookData.name} onChange={handleChange} />
        <input type="text" name="author" placeholder="Author" value={bookData.author} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price (₹)" value={bookData.price} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock Count" value={bookData.stock} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" value={bookData.category} onChange={handleChange} />
        <input type="text" name="type" placeholder="Type (e.g. Hardcover)" value={bookData.type} onChange={handleChange} />
        <input type="text" name="imageUrl" placeholder="Image URL" value={bookData.imageUrl} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={bookData.description} onChange={handleChange} />
        <div className="center-button">
          <button type="submit">Add Book</button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;

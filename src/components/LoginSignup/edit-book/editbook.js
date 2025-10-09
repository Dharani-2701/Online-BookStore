import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../LoginSignup/addbook/addbook.css';

const EditBook = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/books/${id}`)
      .then(response => {
        const data = response.data;
        setName(data.name);
        setAuthor(data.author);
        setPrice(data.price);
        setStock(data.stock);
        setCategory(data.category);
        setType(data.type);
        setDescription(data.description);
        setImageUrl(data.imageUrl || '');
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching book data.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBook = {
      name,
      author,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      type,
      description,
      imageUrl
    };

    axios.put(`http://localhost:3000/books/${id}`, updatedBook)
      .then(() => {
        navigate('/admin-dashboard');
      })
      .catch(error => {
        setError('Error updating book.');
        console.error('Error updating book:', error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='edit-book-container'>
      <h2>Edit Book</h2>
      {error && <p className='error'>{error}</p>}
      <form onSubmit={handleSubmit} className='edit-book-form'>
        <input 
          type='text'
          placeholder='Book Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input 
          type='text'
          placeholder='Author Name'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input 
          type='number'
          placeholder='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input 
          type='number'
          placeholder='Stock Count'
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <input 
          type='text'
          placeholder='Category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input 
          type='text'
          placeholder='Type'
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <textarea 
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input 
          type='file'
          onChange={handleFileChange}
        />
        {imageUrl && <img src={imageUrl} alt='Book' className='book-image-preview' />}
        <button type='submit'>Update Book</button>
      </form>
    </div>
  );
};

export default EditBook;

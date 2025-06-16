import React, { useEffect, useState } from 'react';
import logoo from '../../assests/logoo.png';
import './accountpage.css';
import { useNavigate } from 'react-router-dom';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [cart] = useState([]);
  const [wishlist] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    details: {
      address: '',
      phone: ''
    }
  });
  const navigate = useNavigate();


  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  }

  const handleCartIconClick = () => {
    const serializableCart = cart.map(item => ({ ...item })); // Create a serializable copy of the cart
    navigate('/cart-page', { state: { cartItems: serializableCart } });
  };

  const handleWishlistIconClick = () => {
    const serializableWishlist = wishlist.map(item => ({ ...item }));
    navigate('/wishlist-page', { state: { wishlistItems: serializableWishlist } });
  };

  const handleSignoutIconClick = () => {
    navigate('/');
  };
  
  
  useEffect(() => {
    const userEmail = localStorage.getItem('loggedInUserId');
    if (userEmail) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const userData = data[0];
            setUser(userData);
            setFormData({
              name: userData.name || '',
              email: userData.email || '',
              username: userData.username || '',
              password: userData.password || '',
              details: {
                address: userData.details?.address || '',
                phone: userData.details?.phone || ''
              }
            });
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const key = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        details: {
          ...prevState.details,
          [key]: value,
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('loggedInUserId');
    if (userEmail) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const userId = data[0].id;
            fetch(`http://localhost:5000/users/${userId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            })
              .then(response => response.json())
              .then(updatedData => {
                setUser(updatedData);
                setIsEditing(false);
              })
              .catch(error => console.error('Error updating user data:', error));
          }
        });
    }
  };

  if (!user) {
    return <div className="account-loading">Loading...</div>;
  }

  return (
    <div className="account-container">
      <div className="dashb">
        <img src={logoo} alt="logo" className="logo" />
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
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' onClick={handleCartIconClick} />
          <FontAwesomeIcon icon ={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />
        </div>

      </div>
    <div className='account-info-card'>
      <h1 className="account-title">Account Details</h1>
      <div className="account-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        {user.details && (
          <div className="personal-details">
            <h2>Personal Details</h2>
            <p><strong>Address:</strong> {user.details.address}</p>
            <p><strong>Phone Number:</strong> {user.details.phone}</p>
          </div>
        )}
      </div>
      <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Details</button>
    </div>
      {isEditing && (
        <form className="edit-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="details.address" value={formData.details.address} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="details.phone" value={formData.details.phone} onChange={handleInputChange} />
          </div>
          <button className="save-button" type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default AccountPage;

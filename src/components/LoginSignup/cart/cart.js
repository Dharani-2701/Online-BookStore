import React, { useEffect, useState } from 'react';
import logoo from '../../assests/logoo.png';
import search_light from '../../assests/search-w.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './cart.css';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  // Fetch the cart items when the component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    fetch('http://localhost:3000/cart')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched cart data:', data); // Debugging output
        setCartItems(data); // Assuming `data` is the array of cart items
      })
      .catch(error => console.error('Error fetching cart:', error));
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    setCartItems(updatedCartItems);
  };

  const handleRemoveItem = (index) => {
    const itemId = cartItems[index].id;
    fetch(`http://localhost:3000/cart/${itemId}`, {
      method: 'DELETE',
    })
    .then(() => {
      const updatedCartItems = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCartItems);
    })
    .catch(error => console.error('Error removing item from cart:', error));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const handleSignoutIconClick = () => {
    navigate('/');
  };

  const handleWishlistIconClick = () => {
    navigate('/wishlist-page', { state: { wishlistItems: wishlist } });
  };

  


  const handleProfileIconClick = () => {
    const loggedInUser = { /* fetch the user details based on login */ };
    navigate('/account', { state: { user: loggedInUser } });
  };

  const handleAddToWishlist = (item) => {
    if (!wishlist.some(wishlistItem => wishlistItem.id === item.id)) {
      fetch('http://localhost:3000/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
      .then(response => response.json())
      .then(newItem => setWishlist(prevWishlist => [...prevWishlist, newItem]))
      .catch(error => console.error('Error adding item to wishlist:', error));
    }
  };

  return (
    <div className='cart-page'>
      <div className='dashb'>
        <img src={logoo} alt='logo' className='logo' />
        <div className='search-box'>
          <input type='text' placeholder='Search' />
          <img src={search_light} alt='search icon' />
        </div>
        <div className='icons'>
          <FontAwesomeIcon icon={faHeart} className='wishlist' onClick={handleWishlistIconClick} />
          <FontAwesomeIcon icon={faUser} className='profile-icon' onClick={handleProfileIconClick} />
          <FontAwesomeIcon icon ={faSignOutAlt} className='signout-icon' onClick={handleSignoutIconClick} />

        </div>
      </div>

      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className='cart-item'>
              <img src={item.imageUrl} alt={item.name} className='cart-item-image' />
              <div className='cart-item-details'>
                <div className='cart-item-title'>{item.name}</div>
                <div className='cart-item-author'>{item.author}</div>
                <div className='cart-item-price'>{`₹${item.price}`}</div>
                <div className='cart-item-quantity'>
                  <label>Quantity:</label>
                  <input
                    type='number'
                    value={item.quantity}
                    min='1'
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                  />
                </div>
                <button className='remove-item' onClick={() => handleRemoveItem(index)}>
                  Remove
                </button>
                <FontAwesomeIcon
                  icon={faHeart}
                  className='wishlist-icon'
                  onClick={() => handleAddToWishlist(item)}
                />
              </div>
            </div>
          ))}
          <div className='cart-total'>
            <h3>Total Price: ₹{calculateTotalPrice()}</h3>
            <button className='checkout-button'>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

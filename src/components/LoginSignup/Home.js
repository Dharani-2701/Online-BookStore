
import './LoginSignup.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToLoginSignup = () => {
    navigate('/login'); // Navigate to /login
  };

  return (
    <div className='background-login-signup'>
        <div className='home-page'>
      <h1 className='home-page-text'>Welcome to Online <span className='home-page-span'>Bookstore!</span></h1>
      <button onClick={goToLoginSignup} className='home-page-button'>
        Go to Login-Signup
      </button>
    </div>
    </div>
  );
}

export default Home;

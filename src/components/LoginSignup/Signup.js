import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const newUser = { name, username, email, password };
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to sign up");
        alert("Signup successful");
        navigate('/login');
      })
      .catch((err) => alert("Signup failed: " + err.message));
  };

  return (
    <div className='background-login-signup'>
      <div className='Container'>
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
        <FontAwesomeIcon icon={faUser}  className='icon'/>
          <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder='Name' required />
        </div>
        <div className="input">
        <FontAwesomeIcon icon={faUserCircle}  className='icon'/>
          <input value={username} onChange={e => setUserName(e.target.value)} type="text" placeholder='Username' required />
        </div>
        <div className="input">
        <FontAwesomeIcon icon={faEnvelope}  className='icon'/>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder='Email' required />
        </div>
        <div className="input">
        <FontAwesomeIcon icon={faLock}  className='icon'/>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='Password' required />
        </div>
        <div className="input">
        <FontAwesomeIcon icon={faLock}  className='icon'/>
          <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder='Confirm Password' required />
        </div>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleSignup}>Sign Up</div>
      </div>
      <p className='already'>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
    </div>
  );
}

export default Signup;
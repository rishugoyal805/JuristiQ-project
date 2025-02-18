import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
  const navigate= useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    navigate('/home'); 
  };
  
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    navigate('/signUp'); 
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <form >
          <label>Email</label>
          <input
            type="email" required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password" required
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#" className="forgot-password">Forgot password?</a>
          <button type="submit" className="login-button" onClick={handleSignIn}>Sign In</button>
          <button type="submit" className="login-button" onClick={handleSignUp}>Sign Up</button>
        </form>
      </div>
    </div>

   
  );
}

export default LoginPage;



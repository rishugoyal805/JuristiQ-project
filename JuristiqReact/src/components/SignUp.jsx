import { useState } from "react"
import { useNavigate } from "react-router-dom";
import './SignUp.css';

function SignUp() {
    const [name, setName]= useState('');
    const [password, setPassword]= useState('');
    const [email, setEmail]= useState('');
    const [regsID, setRegsID]= useState('');
    const [PhoneNo, setPhoneNo]= useState('');

    const navigate = useNavigate();

    const handleClick=(e)=>{
        e.preventDefault();
        console.log("SignUp successful");
        navigate('/');

    }

  return (
    <div className="SignUp-container">
    <div className="SignUp-box">
      <form method="post" >
        <label>Name</label>
        <input
          type="text" required
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Registration ID</label>
        <input
          type="number" required
          placeholder="Enter Registration ID"
          value={regsID}
          onChange={(e) => setRegsID(e.target.value)}
        />
        <label>Email</label>
          <input
            type="email" required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        <label>Phone No.</label>
        <input
          type="number" required
          placeholder="Enter Phone No."
          value={PhoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
        />
        <label>Create Password</label>
        <input
          type="password" required
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
    
        <a href="#" className="forgot-password">Forgot password?</a>
        <button type="submit" className="SignUp-button" onClick={handleClick}>Sign In</button>
        
      </form>
    </div>
  </div>
  )
}

export default SignUp
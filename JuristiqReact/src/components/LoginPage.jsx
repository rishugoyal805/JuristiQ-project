import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true } // To handle cookies (JWT authentication)
      );

      if (response.status === 200) {
        navigate("/home"); // Redirect to home if login is successful
      }
    } catch (error) {
      alert("Invalid credentials! Please sign up.");
      console.error("Login error:", error);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signUp");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form>
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#" className="forgot-password">Forgot password?</a>
          <button type="submit" className="login-button" onClick={handleSignIn}>
            Sign In
          </button>
          <button type="button" className="login-button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;




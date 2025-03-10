import { useState } from "react";
import axios from "axios";
import "./ForgetPassword.css"; 

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/existing", { email, secretKey });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        {/* Left side - Brand/Image */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="logo-container">
              <div className="logo-icon"></div>
              <h1>JuristiQ</h1>
            </div>
  
            <div className="welcome-message">
              <h2>Welcome to JuristiQ</h2>
              <p>Effortless legal case management—secure, organized, and built for advocates.</p>
              <button className="cta-button" >
                Log In Now <span className="arrow-icon">→</span>
              </button>
            </div>
          </div>
          <br></br>
          <div className="wave-container">
            <div className="wave-decoration"></div>
          </div>
        </div>
  
        {/* Right side - Forget Password Form */}
        <div className="forget-password-container">
          <div className="forget-password-box">
            <h2 className="forgot-heading">Forgot password</h2>
            <form onSubmit={handleSubmit} className="forget-password-form">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="password"
                placeholder="Enter secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
                className="input-field"
              />
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ForgetPassword;


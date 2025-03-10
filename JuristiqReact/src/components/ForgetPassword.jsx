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
    <div className="forget-password-container">
      <h2>Verify Email & Secret Key</h2>
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
  );
};

export default ForgetPassword;


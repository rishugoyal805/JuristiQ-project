import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  // Send OTP to user's email
  const handleEmailSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/advocate", { email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Try again.");
    }
  };

  // Verify OTP
  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/verifyotp", { email, otp });
      if (response.status === 200) {
        setOtpVerified(true);
        alert("OTP Verified! You can now create a password.");
      }
    } catch (error) {
      alert("Invalid OTP. Try again.");
      console.error("OTP Verification error:", error);
    }
  };

  // Register the user in the database
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify OTP first.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
        age,
      });

      if (response.status === 200) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Signup failed. User may already exist.");
    }
  };

  return (
    <div className="SignUp-container">
      <div className="SignUp-box">
        <form>
          <label>Name</label>
          <input type="text" required placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Age</label>
          <input type="number" required placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />

          <label>Email</label>
          <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" className="Email-button" onClick={handleEmailSubmit} disabled={otpSent}>
            Send OTP
          </button>

          {otpSent && !otpVerified && (
            <>
              <label>OTP</label>
              <input type="number" required placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="button" className="Otp-button" onClick={handleOtpSubmit}>
                Verify OTP
              </button>
            </>
          )}

          {otpVerified && (
            <>
              <label>Create Password</label>
              <input type="password" required placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="SignUp-button" onClick={handleSignUp}>
                Sign Up
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;


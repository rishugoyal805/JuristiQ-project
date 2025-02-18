import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [regsID, setRegsID] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-otp", { email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      if (response.status === 200) {
        setOtpVerified(true);
        alert("OTP Verified! You can now create a password.");
      }
    } catch (error) {
      alert("Invalid OTP. Try again.",error);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("SignUp successful");
    navigate("/");
  };

  return (
    <div className="SignUp-container">
      <div className="SignUp-box">
        <form method="post">
          <label>Name</label>
          <input type="text" required placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Registration ID</label>
          <input type="number" required placeholder="Enter Registration ID" value={regsID} onChange={(e) => setRegsID(e.target.value)} />

          <label>Phone No.</label>
          <input type="number" required placeholder="Enter Phone No." value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />

          <label>Email</label>
          <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" onClick={handleEmailSubmit} disabled={otpSent}>Send OTP</button>

          {otpSent && !otpVerified && (
            <>
              <label>OTP</label>
              <input type="number" required placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="button" onClick={handleOtpSubmit}>Verify OTP</button>
            </>
          )}

          {otpVerified && (
            <>
              <label>Create Password</label>
              <input type="password" required placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="SignUp-button" onClick={handleSignUp}>Sign Up</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;

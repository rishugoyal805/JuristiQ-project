import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // **Step 1: Check Email and Send OTP**
  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/send-otp", { email });

      if (response.status === 200) {
        setOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        alert("Email not found in advocate database.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  // **Step 2: Verify OTP**
  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/verify-otp", { email, otp });

      if (response.status === 200) {
        setOtpVerified(true);
        alert("OTP Verified! You can now reset your password.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification error:", error);
      alert("Error verifying OTP.");
    }
    setLoading(false);
  };

  // **Step 3: Update Password**
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify the OTP first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/reset-password", { email, password });

      if (response.status === 200) {
        alert("Password reset successful! Please log in.");
        navigate("/login"); // Redirect to login page
      } else {
        alert("Error resetting password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <div className="SignIn-container">
      <div className="SignIn-box">
        <form>
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent}
          />
          <button type="button" className="Email-button" onClick={handleEmailSubmit} disabled={otpSent || loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {otpSent && !otpVerified && (
            <>
              <label>OTP</label>
              <input
                type="number"
                required
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className="Otp-button" onClick={handleOtpSubmit} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {otpVerified && (
            <>
              <label>New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="SignIn-button" onClick={handleResetPassword} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;

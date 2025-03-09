"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./LoginPage.css"

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:5173/login", { email, password }, { withCredentials: true })

      if (response.status === 200) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/home")
        }, 1000)
      }
    } catch (error) {
      setError("Invalid credentials! Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    navigate("/signUp")
  }

  const handleComerRighTov = () => {
    const button = document.querySelector(".cta-button")
    button.classList.add("clicked")
    setTimeout(() => {
      button.classList.remove("clicked")
    }, 200)
  }

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
              <h2>Pepere vis Larmrte</h2>
              <p>
                Welcome ardeck, matris of the earates yore herite your in sar vider tout there or hight your fine
                onverance.
              </p>
              <button className="cta-button" onClick={handleComerRighTov}>
                Comer righ tov
                <span className="arrow-icon">→</span>
              </button>
            </div>
          </div><br></br>
          <div className="wave-container">
            <div className="wave-decoration"></div>
            <div className="gavel-image">
            <img src="https://t3.ftcdn.net/jpg/06/08/98/88/360_F_608988880_W8haNckegD4WOj9k4f9HAWsol0SxOURy.jpg" alt="Legal gavel" />
          </div>
</div>

        </div>

        {/* Right side - Login form */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2>Welcome back</h2>
              <p>Please sign in to your account</p>
            </div>

            <form onSubmit={handleSignIn} className="login-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">Login successful! Redirecting...</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="divider">
                <span>Or</span>
              </div>

              <button type="button" className="signup-button" onClick={handleSignUp}>
                Create an account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage





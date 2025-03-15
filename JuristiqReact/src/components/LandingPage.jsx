import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";


function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => navigate("/login");
  const handleSignUp = () => navigate("/signUp");

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 200);
  };

  return (
    <div className="landing-page-container">
      <div className="background-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>

      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-icon"></div>
            <h1>JuristiQ</h1>
          </div>

          <nav className="main-navigation">
            <a href="#features">Features</a>
            <a href="#benefits">Feedback</a>
          </nav>

          <div className="header-actions">
            <button className="login-button" onClick={handleGetStarted}>
              Log In
            </button>
            <button className="signup-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Effortless Legal Case Management</h1>
              <p>Secure, organized, and built specifically for advocates. Streamline your practice with JuristiQ.</p>
              <div className="hero-buttons">
                <button className="cta-button" onClick={(e) => { handleButtonClick(e); handleGetStarted(); }}>
                  Get Started <span className="arrow-icon">→</span>
                </button>
                
              </div>
            </div>

            <div className="hero-image-container">
              <div className="hero-image">
                <img src="https://www.hindustantimes.com/ht-img/img/2023/03/23/550x309/The-NJDG-is-a-part-of-the-ongoing-e-courts-integra_1679587800334.jpg" alt="Legal professionals using JuristiQ" />
                <div className="image-overlay"></div>
              </div>

              <div className="stats-card">
                <div className="stats-icon">
                  <div className="icon-circle"></div>
                </div>
                <div className="stats-text">
                  <p className="stats-label">Trusted by</p>
                  <p className="stats-number">2,500+</p>
                  <p className="stats-description">Legal professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Features for Legal Professionals</h2>
            <p>Everything you need to manage cases, clients, and your practice in one secure platform.</p>
          </div>

          <div className="features-grid">
            {[
              "Case Management",
              "Fees Management",
              "Client Portal",
              "Calendar & Deadlines",
              
            ].map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <h3>{feature}</h3>
                <p>{`Manage ${feature.toLowerCase()} effectively.`}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to transform your legal practice?</h2>
              <p>Join thousands of legal professionals who trust JuristiQ for their case management needs.</p>
              <div className="cta-buttons">
                <button className="cta-button white" onClick={(e) => { handleButtonClick(e); handleGetStarted(); }}>
                  Get Started
                </button>
                
              </div>
            </div>

            <div className="cta-image">
              <img src="dashboard.png" alt="JuristiQ dashboard preview" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
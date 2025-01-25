import { useState } from "react";
import SideBar from "./sideBar";
import "./Clients.css";

function Clients() {
  const [showForm, setShowForm] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);

  const handleClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const details = {
      name: formData.get("clientName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    setClientDetails(details);
    setShowForm(false); // Hide the form after submission
  };

  return (
    <div>
      <SideBar />
        <button className="add-client-button" onClick={handleClick}>+</button>
    
      {showForm && (
    <div className="client-form">
        <div className="client-box">
          <form onSubmit={handleFormSubmit}>
            <label>
              Client Name:
            </label><br/>
            <input type="text" name="clientName" required />
            <br />
            <label>
              Email:
            </label><br/>
            <input type="email" name="email" required />
            <br />
            <label>
              Phone:
            </label><br/>
            <input type="tel" name="phone" required />
            <br />
            <button  className="submit-client" type="submit">Submit</button>
          </form>
        </div>
    </div>
      )}

      {/* Card Section */}
      {clientDetails && (
        <div className="client-card">
          <h2>Client Details</h2>
          <p>
            <strong>Name:</strong> {clientDetails.name}
          </p>
          <p>
            <strong>Email:</strong> {clientDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {clientDetails.phone}
          </p>
        </div>
      )}
    </div>
  );
}

export default Clients;

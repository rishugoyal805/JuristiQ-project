import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "./sideBar";
import "./Clients.css";

function Clients() {
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/clients");
      console.log("Fetched Clients:", response.data);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClient = {
      client_name: formData.get("clientName"),
      phone: formData.get("phone"),
      case_ref_no: formData.get("case_ref_no"),
    };

    try {
      const response = await axios.post("http://localhost:3000/createclient", newClient);
      console.log("New Client Added:", response.data);

      // Update state to reflect the new client
      setClients((prevClients) => [...prevClients, response.data]);

      // Hide the form after submission
      setShowForm(false);
      e.target.reset(); // Clear form fields
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Error adding client. Try again.");
    }
  };

  return (
    <div>
      <SideBar />

      {/* Add Client Button */}
      <button className="add-client-button" onClick={() => setShowForm(!showForm)}>+</button>

      {/* Overlay & Form */}
      {showForm && <div className="overlay" onClick={() => setShowForm(false)}></div>}
      
      {showForm && (
        <div className="client-form">
          <div className="client-box">
            <form onSubmit={handleFormSubmit}>
              <label>Client Name:</label>
              <input type="text" name="clientName" required />
              <label>Phone:</label>
              <input type="tel" name="phone" required />
              <label>Case ref no.:</label>
              <input type="number" name="case_ref_no" required  min="1" />
              <button className="submit-client" type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="clients-container">
        {clients.map((client, index) => (
          <div className="client-card" key={index}>
            <h2>Client Details</h2>
            <p><strong>Name:</strong> {client.client_name}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Case Ref No.:</strong> {client.case_ref_no}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;


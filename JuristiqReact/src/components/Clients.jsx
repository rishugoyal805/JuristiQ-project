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
    const response = await axios.get("http://localhost:5173/clients"); 
    console.log("Fetched Clients:", response.data); // Debugging
    setClients(response.data); // Update state
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
      await axios.post("http://localhost:5173/createclient", newClient); 
      fetchClients(); // Refresh client list
      setShowForm(false);
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Error adding client. Try again.");
    }
  };

  return (
    <div>
      <SideBar />
      <button className="add-client-button" onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <div className="client-form">
          <form className="client-box" onSubmit={handleFormSubmit}>
            <label>Client Name:</label>
            <input type="text" name="clientName" required />
            <label>Phone:</label>
            <input type="tel" name="phone" required />
            <label>Case ref no.:</label>
            <input type="number" name="case_ref_no" required />
            <button className="submit-client" type="submit">Submit</button>
          </form>
        </div>
      )}

      {/* Card Section */}
      {clients.map((client, index) => (
        <div className="client-card" key={index}>
          <h2>Client Details</h2>
          <p>
            <strong>Name:</strong> {client.client_name}
          </p>
          <p>
            <strong>Phone:</strong> {client.phone}
          </p>
          <p>
            <strong>Case Ref No.:</strong> {client.case_ref_no}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Clients;

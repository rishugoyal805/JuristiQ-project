import SideBar from "./sideBar";
import { useState } from "react";
import axios from "axios";
import './sideBar.css';
import './Mycases.css';

function MyCases() {
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Corrected

    const formData = new FormData(e.target);
    const newCase = {
      case_ref_no: formData.get("case_ref_no"), 
      caseTitle: formData.get("caseTitle"),
      clientName: formData.get("clientName"),
      status: formData.get("status"),
      next_hearing: formData.get("hearingDate"), 
      fees: formData.get("totalFees"),
      pending_fees: formData.get("pendingFees"),
    };

    try {
      await axios.post("http://localhost:3000/createcase", newCase); 
      setShowForm(false);
    } catch (error) {
      console.error("Error adding case:", error);
      alert("Error adding case. Try again.");
    }
  };

  return (
    <div>
      <SideBar />
      <button className="add-case-button" onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <div className="case-form">
          <form className="case-box" onSubmit={handleFormSubmit}>
            <label>Case ref no.:</label>
            <input type="number" name="case_ref_no" required /> 
            
            <label>Case Title:</label>
            <input type="text" name="caseTitle" required />

            <label>Client name:</label>
            <input type="text" name="clientName" required />

            <label>Status:</label>
            <select name="status" required>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
            </select>

            <label>Next hearing:</label>
            <input type="date" name="hearingDate" required />

            <label>Total fees:</label>
            <input type="number" name="totalFees" required />

            <label>Pending fees:</label>
            <input type="number" name="pendingFees" required />

            <button className="submit-case" type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>

  );
}

export default MyCases;

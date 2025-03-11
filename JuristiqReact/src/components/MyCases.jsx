import SideBar from "./sideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import './sideBar.css';
import './Mycases.css';

function MyCases() {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [cases, setCases] = useState([]);
  const [editingCase, setEditingCase] = useState(null); // Track the case being edited

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getcases");

      // Ensure `nextHearing` is properly parsed as Date objects
      const formattedCases = response.data.map(caseItem => ({
        ...caseItem,
        nextHearing: caseItem.nextHearing ? new Date(caseItem.nextHearing) : null
      }));

      setCases(formattedCases);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const handleClick = () => {
    setShowForm(true);
    setShowTable(false);
    setEditingCase(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCase = {
      case_ref_no: Number(formData.get("case_ref_no")), // ✅ Convert to Number
      caseTitle: formData.get("caseTitle"),
      clientName: formData.get("clientName"),
      status: formData.get("status"),
      nextHearing: formData.get("hearingDate") ? new Date(formData.get("hearingDate")).toISOString() : null, // ✅ Convert to ISO String
      fees: Number(formData.get("totalFees")),         // ✅ Convert to Number
      pending_fees: Number(formData.get("pendingFees")) // ✅ Convert to Number
    };

    try {
      if (editingCase) {
        // If editing, send a PUT request to update the case
        await axios.put(`http://localhost:3000/updatecase/${editingCase.case_ref_no}`, newCase);
      } else {
        // If adding a new case, send a POST request
        await axios.post("http://localhost:3000/createcase", newCase);
      }

      setShowForm(false);
      setShowTable(true);
      fetchCases(); // Refresh table after add/update
    } catch (error) {
      console.error("Error adding/updating case:", error);
      alert("Error processing request. Try again.");
    }
  };

  const handleDelete = async (case_ref_no) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      await axios.delete(`http://localhost:3000/deletecase/${case_ref_no}`);
      fetchCases(); // Refresh table after delete
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Failed to delete case. Try again.");
    }
  };

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setShowForm(true);
    setShowTable(false);
  };

  return (
    <div>
      <SideBar />
      <button className="add-case-button" onClick={handleClick}>
        +
      </button>

      {showForm && (
        <div className="case-form">
          <form className="case-box" onSubmit={handleFormSubmit}>
            <label>Case ref no.:</label>
            <input type="number" name="case_ref_no" required defaultValue={editingCase?.case_ref_no} readOnly={!!editingCase} />

            <label>Case Title:</label>
            <input type="text" name="caseTitle" required defaultValue={editingCase?.caseTitle} />

            <label>Client name:</label>
            <input type="text" name="clientName" required defaultValue={editingCase?.clientName} />

            <label>Status:</label>
            <select name="status" required defaultValue={editingCase?.status}>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>

            <label>Next hearing:</label>
            <input 
              type="date" 
              name="hearingDate" 
              required 
              defaultValue={
                editingCase?.nextHearing 
                  ? new Date(editingCase.nextHearing).toISOString().split('T')[0] 
                  : ''
              }
            />

            <label>Total fees:</label>
            <input type="number" name="totalFees" required defaultValue={editingCase?.fees} />

            <label>Pending fees:</label>
            <input type="number" name="pendingFees" required defaultValue={editingCase?.pending_fees} />

            <button className="submit-case" type="submit">
              {editingCase ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}

      {showTable && (
      <div className="table-container">
        <table >
          <thead>
            <tr>
              <th>Case No.</th>
              <th>Case Title</th>
              <th>Client Name</th>
              <th>Status</th>
              <th>Next Hearing</th>
              <th>Total Fees</th>
              <th>Pending Fees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr key={index}>
                <td>{caseItem.case_ref_no}</td>
                <td>{caseItem.caseTitle}</td>
                <td>{caseItem.clientName}</td>
                <td>{caseItem.status}</td>
                <td>
                  {caseItem.nextHearing 
                    ? new Date(caseItem.nextHearing).toLocaleDateString("en-GB") 
                    : "N/A"
                  }
                </td>  
                <td>{caseItem.fees}</td>
                <td>{caseItem.pending_fees}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(caseItem)}>Update</button>
                  <button className="delete-btn" onClick={() => handleDelete(caseItem.case_ref_no)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default MyCases;







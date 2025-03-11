import SideBar from "./sideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import "./sideBar.css";
import "./Fees.css";

function Fees() {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [fees, setFees] = useState([]);
  const [editingFee, setEditingFee] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getfees");
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const handleClick = () => {
    setShowForm(true);
    setShowTable(false);
    setEditingFee(null);
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setShowForm(true);
    setShowTable(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const feeData = {
      case_ref_no: formData.get("case_ref_no"),
      clientName: formData.get("clientName"),
      fees: formData.get("totalFees"),
      amount_paid: formData.get("amountPaid"),
      pending_fees: formData.get("pendingFees"),
      payment_mode: formData.get("mode"),
      due_date: formData.get("duedate"),
      remarks: formData.get("remarks"),
    };

    try {
      if (editingFee) {
        await axios.put(`http://localhost:3000/updatefee/${editingFee._id}`, feeData);
      } else {
        await axios.post("http://localhost:3000/createfee", feeData);
      }
      setShowForm(false);
      setShowTable(true);
      fetchFees();
    } catch (error) {
      console.error("Error processing fee record:", error);
      alert("Error processing request. Try again.");
    }
  };

  const handleDelete = async (fee) => {
    if (!window.confirm("Are you sure you want to delete this fee record?")) return;
    try {
      await axios.delete(`http://localhost:3000/deletefee/${fee._id}`);
      fetchFees();
    } catch (error) {
      console.error("Error deleting fee record:", error);
      alert("Failed to delete record. Try again.");
    }
  };

  return (
    <div className="fee-container">
      <SideBar />
      {showTable && (
        <button className="add-fee-button" onClick={handleClick}>+</button>
      )}

      {showTable && (
        <div className="fee-table-container">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Case No.</th>
                <th>Client Name</th>
                <th>Total Fees</th>
                <th>Amount Paid</th>
                <th>Pending Fees</th>
                <th>Payment Mode</th>
                <th>Due Date</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee._id}>
                  <td>{fee.case_ref_no}</td>
                  <td>{fee.clientName}</td>
                  <td>{fee.fees}</td>
                  <td>{fee.amount_paid}</td>
                  <td>{fee.pending_fees}</td>
                  <td>{fee.payment_mode}</td>
                  <td>{formatDate(fee.due_date)}</td>
                  <td>{fee.remarks}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(fee)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(fee)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fee-form">
          <div className="fee-box">
            <form onSubmit={handleFormSubmit}>
              <label>Case No:</label>
              <input type="text" name="case_ref_no" defaultValue={editingFee?.case_ref_no || ""} required />

              <label>Client Name:</label>
              <input type="text" name="clientName" defaultValue={editingFee?.clientName || ""} required />

              <label>Total Fees:</label>
              <input type="number" name="totalFees" min="1" defaultValue={editingFee?.fees || ""} required />

              <label>Amount Paid:</label>
              <input type="number" name="amountPaid" min="1" defaultValue={editingFee?.amount_paid || ""} required />

              <label>Pending Fees:</label>
              <input type="number" name="pendingFees" min="1" defaultValue={editingFee?.pending_fees || ""} required />

              <label>Payment Mode:</label>
              <select name="mode" defaultValue={editingFee?.payment_mode || ""} required>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>

              <label>Due Date:</label>
              <input type="date" name="duedate" defaultValue={formatDate(editingFee?.due_date)} required />

              <label>Remarks:</label>
              <textarea name="remarks"rows="4" defaultValue={editingFee?.remarks || ""}></textarea>

              <button type="submit" className="submit-btn"> {editingFee ? "Update" : "Add"} Fee
              </button>
              <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setShowTable(true); }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fees;

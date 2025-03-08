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
      const response = await axios.get("http://localhost:5173/getfees");
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const handleClick = () => {
    setShowForm(true);
    setShowTable(false);
    setEditingFee(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const feeData = {
      case_ref_no: formData.get("case_ref_no"),
      clientName: formData.get("clientName"),
      fees: formData.get("totalFees"),
      amount_paid: formData.get("amountpaid"),
      pending_fees: formData.get("pendingFees"),
      payment_mode: formData.get("mode"),
      due_date: formData.get("duedate"),
      remarks: formData.get("remarks"),
    };

    try {
      if (editingFee) {
        await axios.put(`http://localhost:5173/updatefee/${editingFee.id}`, feeData);
      } else {
        await axios.post("http://localhost:5173/createfee", feeData);
      }
      setShowForm(false);
      setShowTable(true);
      fetchFees();
    } catch (error) {
      console.error("Error processing fee record:", error);
      alert("Error processing request. Try again.");
    }
  };

  const handleDelete = async (feeId) => {
    if (!window.confirm("Are you sure you want to delete this fee record?")) return;
    try {
      await axios.delete(`http://localhost:5173/deletefee/${feeId}`);
      fetchFees();
    } catch (error) {
      console.error("Error deleting fee record:", error);
      alert("Failed to delete record. Try again.");
    }
  };

  const handleEdit = (feeItem) => {
    setEditingFee(feeItem);
    setShowForm(true);
    setShowTable(false);
  };

  return (
    <div>
      <SideBar />
      <button className="add-fee-button" onClick={handleClick}>+</button>

      {showForm && (
        <div className="fee-form">
          <form className="fee-box" onSubmit={handleFormSubmit}>
          <label>Case ref no.:</label>
            <input type="number" name="case_ref_no" required defaultValue={editingFee?.case_ref_no} readOnly={!!editingFee} />

            <label>Client name:</label>
            <input type="text" name="clientName" required defaultValue={editingFee?.clientName} />

            <label>Total fees:</label>
            <input type="number" name="totalFees" required defaultValue={editingFee?.fees} />

            <label>Amount Paid:</label>
            <input type="number" name="amountpaid" required defaultValue={editingFee?.amount_paid} />

            <label>Pending fees:</label>
            <input type="number" name="pendingFees" required defaultValue={editingFee?.pending_fees} />

            <label>Payment mode:</label>
            <input type="text" name="mode" required defaultValue={editingFee?.payment_mode} />

            <label>Due Date:</label>
            <input type="date" name="duedate" required defaultValue={editingFee?.due_date} />

            <label>Remarks:</label>
            <textarea name="remarks" defaultValue={editingFee?.remarks} />

            <button className="submit-case" type="submit">
              {editingFee ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}

      {showTable && (
        <table>
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
            {fees.map((fee, index) => (
              <tr key={index}>
                <td>{fee.case_ref_no}</td>
                <td>{fee.clientName}</td>
                <td>{fee.fees}</td>
                <td>{fee.amount_paid}</td>
                <td>{fee.pending_fees}</td>
                <td>{fee.payment_mode}</td>
                <td>{fee.due_date}</td>
                <td>{fee.remarks}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(fee)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(fee.case_ref_no)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Fees;

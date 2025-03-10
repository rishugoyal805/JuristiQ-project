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
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;  // Change "-" to "/" if needed
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
    <div>
      <SideBar />
      <button className="add-fee-button" onClick={handleClick}>+</button>

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
                <td>{formatDate(fee.due_date)}</td>
                <td>{fee.remarks}</td>
                <td>
                  <button className="edit-btn" onClick={() => setEditingFee(fee)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(fee)}>Delete</button>
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


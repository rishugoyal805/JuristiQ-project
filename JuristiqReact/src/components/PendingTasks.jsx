import { useEffect, useState } from "react";
import axios from "axios";

function PendingTasks() {
  const [pendingCases, setPendingCases] = useState([]);

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pendingcases", { withCredentials: true });
        setPendingCases(response.data);
      } catch (error) {
        console.error("Error fetching pending cases:", error);
      }
    };

    fetchPendingCases();
  }, []);

  return (
    <div className="tasks">
      <h2>Pending Cases</h2>
      {pendingCases.length > 0 ? (
        <ul>
          {pendingCases.map((c, index) => (
            <li key={index}>
              <strong>{c.caseTitle}</strong> - {c.clientName} (Next Hearing: {c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : "Not Scheduled"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending cases found.</p>
      )}
    </div>
  );
}

export default PendingTasks;


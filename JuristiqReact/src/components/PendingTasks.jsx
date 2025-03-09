
import { useEffect, useState } from "react";

function PendingTasks() {
  const [pendingCases, setPendingCases] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/pendingcases") // Ensure this matches your backend URL
      .then((res) => res.json())
      .then((data) => setPendingCases(data))
      .catch((err) => console.error("Error fetching pending cases:", err));
  }, []);

  return (
    <div className="tasks">
      <h2>Pending Cases</h2>
      <ul>
        {pendingCases.map((c, index) => (
          <li key={index}>
            <strong>{c.caseTitle}</strong> - {c.clientName} (Next Hearing: {new Date(c.nextHearing).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingTasks;

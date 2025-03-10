import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./calender.css"; // Custom styles for red marking

function Calender() {
  const [hearingDates, setHearingDates] = useState([]);

  useEffect(() => {
    const fetchHearingDates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hearings", { withCredentials: true });

        // Convert to Date objects and normalize to remove time component
        const formattedDates = response.data.map(date => {
          const d = new Date(date);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        });

        setHearingDates(formattedDates);
      } catch (error) {
        console.error("Error fetching hearing dates:", error);
      }
    };

    fetchHearingDates();
  }, []);

  return (
    <div className="calender">
      <Calendar
        tileClassName={({ date }) => {
          const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

          return hearingDates.some(d => d.getTime() === normalizedDate.getTime())
            ? "highlight" // Apply CSS class
            : null;
        }}
      />
    </div>
  );
}

export default Calender;




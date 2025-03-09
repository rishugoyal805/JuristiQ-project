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

        // Convert to Date objects
        const formattedDates = response.data.map(date => new Date(date.split("T")[0])); // Ensure only the date part

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
          return hearingDates.some((d) => {
            return d.getFullYear() === date.getFullYear() &&
                   d.getMonth() === date.getMonth() &&
                   d.getDate() === date.getDate();
          }) ? "highlight" : null;
        }}
        
      />
    </div>
  );
}

export default Calender;



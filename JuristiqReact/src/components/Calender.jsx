import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./calender.css"; 
function Calender() {
  const [hearingDate, setHearingDates] = useState([]);

  useEffect(() => {
    const fetchHearingDates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hearings", { withCredentials: true });

        console.log("Fetched hearing dates:", response.data); // Debugging log

        // Convert dates to YYYY-MM-DD format for accurate comparison
        const formattedDates = response.data.map(date => {
          const localDate = new Date(date);
          localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
          return localDate.toISOString().split("T")[0];
        });
        

        console.log("Formatted hearing dates:", formattedDates); // Debugging log

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
          const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

          return hearingDate.includes(formattedDate) ? "highlight" : null;
        }}
      />
    </div>
  );
}

export default Calender;

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

function HearingCalendar() {
  const [hearingDates, setHearingDates] = useState([]);

  useEffect(() => {
    const fetchHearingDates = async () => {
      try {
        const response = await axios.get("http://localhost:5173/api/cases/hearings");
        setHearingDates(response.data.map(date => new Date(date))); // Convert to Date objects
      } catch (error) {
        console.error("Error fetching hearing dates:", error);
      }
    };

    fetchHearingDates();
  }, []);

  return (
    <div className="calender">
      <Calendar
        tileClassName={({ date }) =>
          hearingDates.some((d) => d.toDateString() === date.toDateString()) ? "highlight" : null
        }
      />
    
    </div>
  );
}

export default HearingCalendar;


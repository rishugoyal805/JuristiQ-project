import SideBar from "./sideBar"
import { useState } from "react";
import './sideBar.css'

function MyCases() {
  const [showForm, setShowForm] = useState(false);

  // const handleFormSubmit= async (e)=>{
  //   e.preventdefault();
  //   const formData = new FormData(e.target);
  //   const newCase={

  //   }
  // }
  return (
    <div>
        <SideBar/>
        <button className="add-client-button" onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <div className="client-form">
          <form /*onSubmit={handleFormSubmit}*/>
          <label>Case ref no.:</label>
          <input type="number" name="case-ref-no" required />
            <label>Client Name:</label>
            <input type="text" name="clientName" required />
            <label>Phone:</label>
            <input type="tel" name="phone" required />
            <label>Phone:</label>
            <input type="tel" name="phone" required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default MyCases

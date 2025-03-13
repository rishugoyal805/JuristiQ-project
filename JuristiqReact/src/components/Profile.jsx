import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import SideBar from "./sideBar";

function Profile() {
  const [advocate, setAdvocate] = useState({
    name: "",
    email: "",
    age: "",
    contact: "",
    casesHandled: 0,
    casesWon: 0,
    profilePic: ""
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchCaseStatistics();
    };
    fetchData();
  }, []);  

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profile", { withCredentials: true });
      setAdvocate(prev => ({ ...prev, ...response.data }));
      fetchCaseStatistics(); // Ensure this runs after setting profile
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
    

  const fetchCaseStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getcases");
      const cases = response.data;
      const casesHandled = cases.length;
      const casesWon = cases.filter(c => c.status.toLowerCase() === "won").length;
      
      setAdvocate(prev => ({ 
        ...prev, 
        casesHandled: casesHandled || prev.casesHandled, 
        casesWon: casesWon || prev.casesWon 
      }));
    } catch (error) {
      console.error("Error fetching case statistics:", error);
    }
  };  

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:3000/updateProfile", advocate, { withCredentials: true });
      alert("Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdvocate((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    
    <div className={`profile-container ${editMode ? "edit-mode" : ""}`}>
      <SideBar />
      
      <div className="profile-content">
        <h2>Advocate Profile</h2>
        <div className="profile-pic-section">
          <img src={advocate.profilePic || "default-avatar.png"} alt="Profile" className="profile-pic" />
          {editMode && <input type="file" accept="image/*" onChange={handleProfilePicUpload} />}
        </div>
        <div className="profile-details">
          <label>Name:</label>
          {editMode ? (
            <input type="text" value={advocate.name} onChange={(e) => setAdvocate({ ...advocate, name: e.target.value })} />
          ) : (
            <p>{advocate.name}</p>
          )}

          <label>Age:</label>
          {editMode ? (
            <input type="number" value={advocate.age} onChange={(e) => setAdvocate({ ...advocate, age: e.target.value })} />
          ) : (
            <p>{advocate.age}</p>
          )}

          <label>Contact:</label>
          {editMode ? (
            <input type="text" value={advocate.contact} onChange={(e) => setAdvocate({ ...advocate, contact: e.target.value })} />
          ) : (
            <p>{advocate.contact}</p>
          )}
        </div>

        {!editMode && (
          <div className="case-statistics">
            <h3>Case Statistics</h3>
            <p>Cases Handled: {advocate.casesHandled}</p>
            <p>Cases Won: {advocate.casesWon}</p>
          </div>
        )}

        {editMode ? (
          <button onClick={handleUpdate} className="save-button">Save</button>
        ) : (
          <button onClick={() => setEditMode(true)} className="edit-button">Edit Profile</button>
        )}
      </div>
    </div>
  );
}

export default Profile;


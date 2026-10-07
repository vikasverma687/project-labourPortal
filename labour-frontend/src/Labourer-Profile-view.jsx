import React, { useEffect, useState } from "react";
import Navigation from "./Navigation"; // Make sure the path matches where your Navigation component is located
import "./Css/LabourerProfileView.css";
import { useNavigate } from "react-router-dom";

function LabourerProfileView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [available, setAvailable] = useState(false);
  const [experience, setExperience] = useState("");
  const [skill, setSkills] = useState([]);
  const [location, setLocation] = useState("");
  const [pincode, setPinCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/labourer/getLabourerProfile/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data || !data.data) {
        setMessage(data?.message || "Error occurred while fetching profile data.");
        setLoading(false);
        return;
      }
      const info = data.data;
      setFirstName(info.firstName || "");
      setLastName(info.lastName || "");
      setExperience(info.experience || "");
      setAvailable(info.available ?? false);
      setPinCode(info.pincode || "");
      setSkills(info.skillArray || [] || "");
      setLocation(info.location || "");
      setMessage(data.message || "");
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navigation />
        <div className="profile-container">
          <div className="profile-loader">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Navigation Bar at the top of the page */}
      <Navigation />

      {/* Main Profile Content */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {firstName ? firstName.charAt(0).toUpperCase() : "L"}
            </div>
            <div className="profile-title-group">
              <h2>{firstName} {lastName}</h2>
              <span className={`status-badge ${available ? "available" : "busy"}`}>
                <span className="status-dot"></span>
                {available ? "Available for Work" : "Not Available"}
              </span>
            </div>
          </div>

          {/* Optional Server Message Alert */}
          {message && <div className="profile-alert">{message}</div>}

          {/* Profile Details Grid */}
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Experience</span>
              <span className="detail-value">{experience ? `${experience} Years` : "Not specified"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Skills</span>
              <span className="detail-value">{ skill.length>0?skill.join(", ") : "not specified"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">{location || "Not specified"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Pincode</span>
              <span className="detail-value">{pincode || "Not specified"}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => navigate("/Labourer-Profile",{ state: {firstName , lastName , experience , location , pincode, available}})}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabourerProfileView;
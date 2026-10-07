import React, { useEffect, useState } from "react";// Make sure the path matches where your Navigation component is located
import "./Css/LabourerProfileView.css";
import NavbarCustomer from "./NavbarCustomer";
import { useNavigate } from "react-router-dom";

function CustomerProfileView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone , setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPinCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/customer/getCustomerProfile/${customerId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data || !data.profile) {
        setMessage(data?.message || "Error occurred while fetching profile data.");
        setLoading(false);
        return;
      }
      const info = data.profile;
      setFirstName(info.firstName || "");
      setLastName(info.lastName || "");
      setPinCode(info.pincode || "");
      setLocation(info.location || "");
      setPhone(info.phone || "");
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
      
        <div className="profile-container">
          <div className="profile-loader">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Navigation Bar at the top of the page */}
      
<NavbarCustomer/>
      {/* Main Profile Content */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {firstName ? firstName.charAt(0).toUpperCase() : "L"}
            </div>
            <div className="profile-title-group">
              <h2>{firstName} {lastName}</h2>

            </div>
          </div>

          {/* Optional Server Message Alert */}
          {message && <div className="profile-alert">{message}</div>}

          {/* Profile Details Grid */}
          <div className="profile-details-grid">


            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">{location || "Not specified"}</span>
            </div>

              
            <div className="detail-item">
              <span className="detail-label">phone number</span>
              <span className="detail-value">{phone || "Not specified"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Pincode</span>
              <span className="detail-value">{pincode || "Not specified"}</span>
            </div>

          </div>

          {/* Action Button */}
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => navigate("/Customer-Profile",{ state: {firstName , lastName  , location , pincode}})}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfileView;
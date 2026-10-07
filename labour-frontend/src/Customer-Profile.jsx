import React, { useEffect, useState } from "react";
import "./Css/Customer-Profile.css";
import { useNavigate } from "react-router-dom";

function CustomerProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPinCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("userId");
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
        setLoading(false);
        return;
      }

      const info = data.profile;
      setFirstName(info.firstName || "");
      setLastName(info.lastName || "");
      setPhone(info.phone || "");
      setPinCode(info.pincode || "");
      setLocation(info.location || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/api/customer/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          location,
          pincode,
        }),
      });


      console.log("status:", response.status);
      console.log("ok:", response.ok);

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => navigate("/HomePageCustomer"), 1500);
      } else {
        setMessage(data?.message || "Failed to save profile.");
      }
    } catch (error) {
      setMessage("Server error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-loader-box">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-main-card">
        {/* Header Section */}
        <div className="profile-card-header">
          <div className="profile-avatar-placeholder">
            {firstName ? firstName.charAt(0).toUpperCase() : "C"}
          </div>
          <div>
            <span className="profile-subtitle">Welcome</span>
            <h2 className="profile-main-title">Complete Your Customer Profile</h2>
          </div>
        </div>

        {message && (
          <div className={`profile-feedback-banner ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-modern-form">
          {/* Row 1: Name fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2: Phone Number */}
          <div className="form-group full-width">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g., 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Row 3: Location & Pincode */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Current Address / City</label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Area Pincode</label>
              <input
                id="pincode"
                type="text"
                placeholder="e.g., 400001"
                value={pincode}
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn-primary-action">
              Save Profile
            </button>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={() => navigate("/HomePageCustomer")}
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerProfile;
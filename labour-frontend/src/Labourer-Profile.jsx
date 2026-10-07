import React, { useEffect, useState } from "react";
import "./Css/Labourer-Profile.css";
import { data, useNavigate } from "react-router-dom";

const PREDEFINED_SKILLS = [
  "Carpentry",
  "Plumbing",
  "Electrician",
  "Painting",
  "Masonry",
  "Gardening",
  "Cleaning",
  "Welding",
  "HVAC Repair",
  "Roofing",
];

function LabourerProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [available, setAvailable] = useState(false);
  const [experience, setExperience] = useState("");
  const [skill, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPinCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
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
        setLoading(false);
        return;
      }

      const info = data.data;
      setFirstName(info.firstName || "");
      setLastName(info.lastName || "");
      setExperience(info.experience || "");
      setAvailable(info.available ?? false);
      setPinCode(info.pincode || "");
      setSkills((info.skillArray || []).join(", "));
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

  const selectedSkillsList = skill
    ? skill.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleSkillToggle = (skillName) => {
    let updated;
    if (selectedSkillsList.includes(skillName)) {
      updated = selectedSkillsList.filter((s) => s !== skillName);
    } else {
      updated = [...selectedSkillsList, skillName];
    }
    setSkills(updated.join(", "));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const skillArray = selectedSkillsList;

    try {
      const response = await fetch("http://localhost:8080/api/labourer/create_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          available,
          experience,
          skillArray,
          location,
          pincode,
        }),
      });


      console.log("status:", response.status);
      console.log("ok:", response.ok);

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => navigate("/HomePage"), 1500);
      } else {
        setMessage(data?.message || "Failed to save profile.");
      }
    } catch {

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
            {firstName ? firstName.charAt(0).toUpperCase() : "S"}
          </div>
          <div>
            <span className="profile-subtitle">Welcome back, SkillMan</span>
            <h2 className="profile-main-title">Complete Your Professional Profile</h2>
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

          {/* Row 2: Skills Selection Tags */}
          <div className="form-group full-width">
            <label>Expertise & Skills <span className="label-hint">(Select all that apply)</span></label>
            <div className="skills-tags-grid">
              {PREDEFINED_SKILLS.map((s) => {
                const isSelected = selectedSkillsList.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    className={`skill-pill-btn ${isSelected ? "active" : ""}`}
                    onClick={() => handleSkillToggle(s)}
                  >
                    {s} {isSelected && <span className="check-mark">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Experience & Availability */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience">Experience (Years)</label>
              <input
                id="experience"
                type="number"
                min="0"
                placeholder="e.g., 3"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="available">Availability Status</label>
              <select
                id="available"
                value={available} onChange={(e) => {
                  const newValue = e.target.value === "true";
                  setAvailable(newValue);

                }}
              >
                <option value="true">🟢 Available for Work</option>
                <option value="false">🔴 Currently Busy</option>
              </select>
            </div>
          </div>

          {/* Row 4: Location & Pincode */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Current Location / City</label>
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
              onClick={() => navigate("/HomePage")}
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default LabourerProfile;
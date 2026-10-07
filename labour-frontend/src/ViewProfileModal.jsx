import React, { useEffect, useState } from "react";
import "./Css/ViewProfileModal.css";

function ViewProfileModal ({userId , onClose }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [available, setAvailable] = useState(false);
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState([]);
    const [location, setLocation] = useState("");
    const [pincode, setPinCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
      
            loadProfile();
      
    }, []);

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
            setSkills(info.skillArray || info.skills || []);
            setLocation(info.location || "");
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-profile-overlay">
            <div className="view-profile-modal">
                {/* Header */}
                <div className="view-profile-header">
                    <h2>Labourer Profile</h2>
                    <button
                        type="button"
                        className="view-profile-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="view-profile-loading">
                        Loading worker profile...
                    </div>
                ) : message && !firstName ? (
                    <div className="view-profile-error">
                        <p>{message}</p>
                    </div>
                ) : (
                    <div className="view-profile-content">
                        {/* Profile Info Card Header */}
                        <div className="profile-hero-section">
                            <div className="profile-avatar-placeholder">
                                👨‍🔧
                            </div>
                            <div className="profile-main-titles">
                                <h3>{firstName} {lastName}</h3>
                                <span className={`profile-status-pill ${available ? "available" : "offline"}`}>
                                    <span className="dot"></span>
                                    {available ? "Available for Work" : "Currently Offline"}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="view-profile-section">
                            <h4>Worker Information</h4>
                            <div className="view-profile-info-grid">
                                <div className="profile-info-item">
                                    <span className="info-label">Experience</span>
                                    <strong className="info-value">⏳ {experience || "Not specified"}</strong>
                                </div>
                                <div className="profile-info-item">
                                    <span className="info-label">Location / Area</span>
                                    <strong className="info-value">📍 {location || "N/A"}</strong>
                                </div>
                                <div className="profile-info-item">
                                    <span className="info-label">Pincode</span>
                                    <strong className="info-value">📮 {pincode || "N/A"}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="view-profile-section">
                            <h4>Specialized Skills</h4>
                            {skills.length === 0 ? (
                                <p className="empty-text">No skills listed.</p>
                            ) : (
                                <div className="profile-skills-list">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="profile-skill-tag">
                                            {typeof skill === "string" ? skill.trim() : skill.skillName || "Skill"}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions Footer */}
                        <div className="view-profile-actions">
                            <button
                                type="button"
                                className="action-btn outline"
                                onClick={onClose}
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewProfileModal;
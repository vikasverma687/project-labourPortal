import React, { useEffect, useState } from "react";
import "./Css/ViewJobModal.css";
import getTimeAgo from "./utils/TImeUtils";

function ViewJobModal({ jobId, onClose, onReload, role, onApplied }) {
    console.log("top console job id is " + jobId);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showSubmit, setShowSubmit] = useState(false);

    useEffect(() => {
        const loadJob = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://localhost:8080/api/job/getJobPostById/${jobId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log("Failed to fetch job");
                    return;
                }

                setJob(data.job);
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            loadJob();
        }
    }, [jobId]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:8080/api/job/deleteJobPost/${jobId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            if (response.ok) {
                alert("Job deleted successfully");
                onClose();
                if (onReload) onReload();
            } else {
                alert("Unable to delete job");
            }
        } catch (error) {
            console.error("Delete error:", error);
            
        }
    };

    const handleApply = async () => {

        setShowMessage(true);
        setShowSubmit(true);
        console.log("job id is handle apply " + jobId);
    };

    const onSubmitApplication = async () => {
        const token = localStorage.getItem("token");
        const targetJobId = jobId;
        try {
            const response = await fetch(
                "http://localhost:8080/api/job/applyJobApp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({ jobId: targetJobId, message })
                }
            );

            if (response.ok) {

                onApplied
                alert("Applied for job successfully!");
                onClose();
                if (onReload) onReload();
            } else {
                alert("Some problem occurred while applying!");
            }
        } catch (error) {
            console.error("Server error:", error);
            alert("Server error");
        }
    };

    return (
        <div className="view-job-overlay">
            <div className="view-job-modal">
                {/* Header */}
                <div className="view-job-header">
                    <h2>Job Details</h2>
                    <button
                        type="button"
                        className="view-job-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="view-job-loading">
                        Loading job details...
                    </div>
                ) : !job ? (
                    <div className="view-job-not-found">
                        <h3>Job not found</h3>
                        <button className="view-job-cancel-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="view-job-content">
                        {/* Title Section */}
                        <div className="view-job-title-section">
                            <div>
                                <span className="view-job-category">
                                    {job.category}
                                </span>
                                <h1>{job.jobTitle}</h1>
                                <p className="view-job-posted">
                                    ⏳ Posted {getTimeAgo(job.created_at)}
                                </p>
                            </div>
                            <span className={`view-job-status ${job.status?.toLowerCase() || 'open'}`}>
                                {job.status || "Open"}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="view-job-section">
                            <h3>Description</h3>
                            <p className="view-job-description">
                                {job.description}
                            </p>
                        </div>

                        {/* Job Information Grid */}
                        <div className="view-job-section">
                            <h3>Job Information</h3>
                            <div className="view-job-info-grid">
                                <div className="view-job-info-item">
                                    <span className="info-label">Location</span>
                                    <strong className="info-value">📍 {job.location}</strong>
                                </div>
                                <div className="view-job-info-item">
                                    <span className="info-label">Phone</span>
                                    <strong className="info-value">📞 {job.phone || "N/A"}</strong>
                                </div>
                                <div className="view-job-info-item">
                                    <span className="info-label">Budget</span>
                                    <strong className="info-value text-green">₹{job.budget}</strong>
                                </div>
                                <div className="view-job-info-item">
                                    <span className="info-label">Preferred Date</span>
                                    <strong className="info-value">
                                        📅 {job.preferred_date ? new Date(job.preferred_date).toLocaleString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        }) : "Not specified"}
                                    </strong>
                                </div>
                                <div className="view-job-info-item">
                                    <span className="info-label">Urgency</span>
                                    <strong className={`info-value ${job.urgency === 'Urgent' ? 'text-red' : ''}`}>
                                        ⚡ {job.urgency}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Required Skills */}
                        {job.requiredSkills && (
                            <div className="view-job-section">
                                <h3>Required Skills</h3>
                                <div className="view-job-skills">
                                    {job.requiredSkills
                                        .split(",")
                                        .map((skill, index) => (
                                            <span
                                                className="view-job-skill-tag"
                                                key={index}
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {/* Message Input Section */}
                        {showMessage && (
                            <div className="view-job-section application-message-section">
                                <h3>Your Message to Client</h3>
                                <textarea
                                    className="view-job-textarea"
                                    value={message}
                                    placeholder="Write a short message or note for the client..."
                                    rows="3"
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="view-job-actions">
                            <button
                                type="button"
                                className="view-job-cancel-btn"
                                onClick={onClose}
                            >
                                Close
                            </button>

                            {role === "CUSTOMER" ? (
                                <button
                                    type="button"
                                    className="view-job-delete-btn"
                                    onClick={handleDelete}
                                >
                                    🗑 Delete Job
                                </button>
                            ) : !showSubmit ? (
                                <button
                                    type="button"
                                    className="view-job-apply-btn"
                                    onClick={handleApply}
                                >
                                    ✓ Apply for Job
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="view-job-apply-btn"
                                    onClick={onSubmitApplication}
                                >
                                    Submit Application
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewJobModal;
import React, { useEffect, useState } from "react";
import NavbarCustomer from "./NavbarCustomer";
import ViewJobModal from "./ViewJobModal"; // Make sure the path matches your project setup
import "./Css/MyJobs.css";

function MyJobs() {
    const [activeJobs, setActiveJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Modal states
    const [showViewJob, setShowViewJob] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    

    const getTimeAgo = (createdAt) => {
        if (!createdAt) return "";
        const createdTime = new Date(createdAt);
        const currentTime = new Date();
        const difference = currentTime - createdTime;

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

        return createdTime.toLocaleDateString("en-IN");
    };

    // Fetch jobs posted by the customer
    const fetchMyJobs = async () => {
        const token = localStorage.getItem("token");
        // Replace with your actual backend endpoint for fetching customer's jobs
        try {
            const response = await fetch("http://localhost:8080/api/job/getJobPost", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const data = await response.json();

            if (response.ok) {
                setActiveJobs(data.jobs || data.data || []);
            } else {
                setMessage(data?.message || "Failed to load your job posts.");
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setMessage("Server error while fetching jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    return (
        <div className="my-jobs-wrapper">
            <NavbarCustomer />

            <div className="my-jobs-container">
                <div className="my-jobs-header">
                    <div>
                        <h1>My Job Posts</h1>
                        <p>Manage and track all the work requests you have published.</p>
                    </div>
                </div>

                {message && <div className="my-jobs-alert">{message}</div>}

                {loading ? (
                    <div className="my-jobs-loading">Loading your job posts...</div>
                ) : activeJobs.length === 0 ? (
                    <div className="my-jobs-empty">
                        <h3>No jobs posted yet</h3>
                        <p>Create a new job request to start receiving worker proposals.</p>
                    </div>
                ) : (
                    <div className="jobs-list">
                        {activeJobs.map((job) => {
                            // Support both 'id' and 'jobId' properties depending on backend model
                            const jobId = job.jobId || job.id;
                            return (
                                <div key={jobId} className="job-item-card">
                                    <div className="job-item-info">
                                        <div className="job-title-row">
                                            <h3>🔨 {job.jobTitle}</h3>
                                            <span className={`job-status-pill ${job.status?.toLowerCase() || 'open'}`}>
                                                {job.status || "Open"}
                                            </span>
                                        </div>
                                        <div className="job-meta">
                                            <span>📍 Location: {job.location}</span>
                                            <span>⏳ Posted on: {getTimeAgo(job.created_at)}</span>
                                            <span className="highlight-tag">Workers interested: {job.interested || 0}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-outline-action"
                                        onClick={() => {
                                            console.log("JOB ID:", jobId);
                                            setSelectedJobId(jobId);
                                            setShowViewJob(true);
                                            
                                        }}
                                    >
                                        View Requests
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* View Job & Requests Modal */}
            {showViewJob && (
                <ViewJobModal
                    jobId={selectedJobId}
                    role = {localStorage.getItem("role")}
                    onClose={() => {
                        setShowViewJob(false);
                        fetchMyJobs(); // Refresh list in case a job was deleted
                    }}
                />
            )}
        </div>
    );
}

export default MyJobs;
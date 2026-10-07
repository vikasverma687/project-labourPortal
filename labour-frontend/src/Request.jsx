import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarCustomer from "./NavbarCustomer";
import getTimeAgo from "./utils/TImeUtils";
import ViewProfileModal from "./ViewProfileModal";
import "./Css/Request.css";

function Request() {
    const navigate = useNavigate();
    const [activeJobs, setActiveJobs] = useState([]);
    const [jobApplications, setJobApplications] = useState({});
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [viewProfile, setViewProfile] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        loadJobPosts();
    }, []);

    // Fetch applications whenever activeJobs change
    useEffect(() => {
        if (activeJobs.length > 0 && token) {
            activeJobs.forEach((job) => {
                if (job.jobId) {
                    loadApplication(job.jobId);
                }
            });
        }
    }, [activeJobs, token]);

    const loadJobPosts = async () => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        try {
            const response = await fetch("http://localhost:8080/api/job/getJobPost", {
                headers: {
                    "Authorization": "Bearer " + storedToken
                },
                method: "GET"
            });
            const data = await response.json();
            if (response.ok) {
                setActiveJobs(data.jobs || []);
            } else {
                console.log("Some problem occurred fetching job posts!");
            }
        } catch (error) {
            console.error("Server error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadApplication = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/job/getJobApplications/${jobId}`, {
                headers: {
                    "Authorization": "Bearer " + token
                },
                method: "GET"
            });
            const data = await response.json();

            if (response.ok) {
                setJobApplications((prev) => ({
                    ...prev,
                    [jobId]: data.applications || data || []
                }));
            } else {
                console.log("Some problem occurred fetching applications for job " + jobId);
            }
        } catch (error) {
            console.error("Server error:", error);
        }
    };


    if (loading) {
        return (
            <div className="request-wrapper">
                <NavbarCustomer />
                <div className="request-loader">Loading client requests...</div>
            </div>
        );
    }

    return (
        <div className="request-wrapper">
            
            <NavbarCustomer />

            <div className="request-container">
                <div className="request-page-header">
                    <h1>Worker Applications 📥</h1>
                    <p>Review incoming applications from skilled labourers on your active job posts.</p>
                </div>

                {activeJobs.length === 0 ? (
                    <div className="request-empty-card">
                        <p>You have no active job posts right now.</p>
                    </div>
                ) : (
                    <div className="job-requests-list">
                        {activeJobs.map((job) => {
                            const applications = jobApplications[job.jobId] || [];

                            return (
                                <div key={job.jobId || job.id} className="job-request-card">
                                    {/* Job Post Title Header */}
                                    <div className="job-request-header">
                                        <div className="job-title-info">
                                            <span className="job-badge">{job.category || "General Work"}</span>
                                            <h2>{job.jobTitle}</h2>
                                        </div>
                                        <span className="application-count-badge">
                                            {applications.length} {applications.length === 1 ? "Application" : "Applications"}
                                        </span>
                                    </div>

                                    {/* Applications List */}
                                    <div className="applicants-container">
                                        {applications.length === 0 ? (
                                            <p className="no-applicants-text">No applications received for this job yet.</p>
                                        ) : (
                                            applications.map((app, index) => (
                                                <div key={app.id || index} className="applicant-item-card">
                                                    <div className="applicant-info">
                                                        <div className="applicant-main-row">
                                                            <h4>👤 {app.labourer_name || "Worker"}</h4>
                                                            <span className="applied-time">
                                                                ⏳ Applied {getTimeAgo(app.applied_at)}
                                                            </span>
                                                        </div>
                                                        {app.message && (
                                                            <p className="applicant-message">
                                                                "{app.message}"
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="applicant-actions">
                                                        <button
                                                            className="action-btn sm outline"
                                                            onClick={
                                                                () => {
                                                                    setSelectedId(app.labourer_id)
                                                                    setViewProfile(true)
                                                                }}
                                                        >
                                                            View Profile
                                                        </button>
                                                        {viewProfile && (
                                                            <ViewProfileModal
                                                                userId={selectedId}
                                                                onClose={() => setViewProfile(false)}
                                                            />
                                                        )}
                                                        <button
                                                            className="action-btn sm"
                                                            onClick={() => alert(`Accept application for ${app.labourer_name}`)}
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>

                                                </div>
                                            ))
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Request;
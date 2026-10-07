import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarCustomer from "./NavbarCustomer";
import "./Css/HomePageCustomer.css";
import PostJobModal from "./PostJobModal";
import ViewJobModal from "./ViewJobModal";





function HomePageCustomer() {
    const navigate = useNavigate();

    // Mock data state for dashboard widgets
    const [customerName] = useState("Vikas");
    const [unreadNotificationsCount] = useState(3); // Example count for the bell badge

    const [showPostJob, setShowPostJob] = useState(false);
    const [showViewJob, setShowViewJob] = useState(false);

    const [selectedJobId, setSelectedJobId] = useState(null);

    const [activeJobs, setActiveJobs] = useState([]);

    const [pendingRequests, setPendingRequests] = useState([
        { id: 1, name: "Rajesh Kumar", skill: "Plumbing", rating: 4.7 }
    ]);

    const [currentJob, setCurrentJob] = useState({
        title: "Bathroom Plumbing",
        workerName: "Rajesh Kumar",
        workerRating: 4.7,
        status: "🟢 Worker Accepted",
        location: "Bhopal"
    });

    const [jobHistory] = useState([
        { id: 1, title: "House Painting", amount: "₹5,000", date: "Last week" },
        { id: 2, title: "Electrical Repair", amount: "₹1,200", date: "2 weeks ago" },
        { id: 3, title: "Plumbing", amount: "₹800", date: "1 month ago" }
    ]);

    const handleAcceptRequest = (id) => {
        setPendingRequests(pendingRequests.filter(req => req.id !== id));
        alert("Worker request accepted successfully!");
    };

    const handleRejectRequest = (id) => {
        setPendingRequests(pendingRequests.filter(req => req.id !== id));
    };

    const getTimeAgo = (created_at) => {

        const created_time = new Date(created_at);
        const current_time = new Date();

        const differnce_time = current_time - created_time;

        const seconds = Math.floor(differnce_time / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const day = Math.floor(hours / 24);
        const week = Math.floor(day / 7);

        if (seconds < 60) {
            return "just now";
        }

        if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
        }

        if (hours < 24) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`
        }

        if (day < 7) {
            return `${day}day${day > 1 ? "s" : ""} ago`
        }

        if (week < 5) {
            return `${week} week${week > 1 ? "s" : ""} ago`
        }

    }

    const loadHomePage = async () => {
        console.log("LOAD HOME PAGE STARTED");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/job/getJobPost", {
                headers: {
                    "Authorization": "Bearer " + token
                },
                method: "GET"
            })
            const data = await response.json();
            setActiveJobs(data.jobs)

            if (response.ok) {
                console.log("successfully fetched! " + jobData)
            } else {
                console.log("some problem occured in backend!")
            }
        } catch {
            console.log("server error")
        }
    }



    useEffect(() => {
        loadHomePage();
    }, [])

    return (
        <div className="customer-dashboard-wrapper">
            <NavbarCustomer />

            <div className="customer-dashboard-container">

                {/* 1. Welcome Section with Bell Notification Icon */}
                <section className="welcome-section">
                    <div className="welcome-content">
                        <h1>Welcome back, {customerName} 👋</h1>
                        <p>What work do you need help with today?</p>
                    </div>

                    <div className="welcome-actions-header">
                        {/* Notification Bell Button */}
                        <button
                            className="notification-bell-btn"
                            onClick={() => navigate("/notifications")}
                            title="View Notifications"
                        >
                            🔔
                            {unreadNotificationsCount > 0 && (
                                <span className="notification-badge">{unreadNotificationsCount}</span>
                            )}
                        </button>

                        <button
                            className="btn-post-job-prominent"
                            onClick={() => setShowPostJob(true)}
                        >
                            ➕ Post a New Job
                        </button>
                        {showPostJob && (<PostJobModal
                            onClose={() => setShowPostJob(false)}
                            onDone={() => loadHomePage()}
                        />)}
                    </div>
                </section>

                {/* 2. Quick Actions Cards */}
                <section className="quick-actions-grid">
                    <div className="action-card" onClick={() => setShowPostJob(true)}>
                        <div className="action-icon bg-sky">➕</div>
                        <h3>Post a Job</h3>
                        <p>Create a new work request</p>
                    </div>

                    <div className="action-card" onClick={() => navigate("/find-worker")}>
                        <div className="action-icon bg-indigo">🔍</div>
                        <h3>Find Worker</h3>
                        <p>Browse nearby labourers</p>
                    </div>

                    <div className="action-card" onClick={() => navigate("/MyJobs")}>
                        <div className="action-icon bg-green">📋</div>
                        <h3>My Jobs</h3>
                        <p>View your active tasks</p>
                    </div>

                    <div className="action-card" onClick={() => navigate("/RequestPage")}>
                        <div className="action-icon bg-amber">💬</div>
                        <h3>Requests</h3>
                        <p>{pendingRequests.length} pending updates</p>
                    </div>
                </section>

                <div className="dashboard-grid-main">
                    {/* Left Column: Active Jobs, Pending Requests & Job History */}
                    <div className="dashboard-left-column">

                        {/* 3. Active Job Posts */}
                        <section className="dashboard-card">
                            <div className="section-card-header">
                                <h2>Your Active Job posts</h2>
                            </div>
                            {activeJobs.length === 0 ? (
                                <p className="empty-state-text">No active jobs posted right now.</p>
                            ) : (
                                <div className="jobs-list">
                                    {activeJobs.map((job) => (
                                        <div key={job.id} className="job-item-card">
                                            <div className="job-item-info">
                                                <h3>🔨 {job.jobTitle}</h3>
                                                <div className="job-meta">
                                                    <span>📍 Location: {job.location}</span>
                                                    <span>⏳ Posted on: {getTimeAgo(job.created_at)}
                                                    </span>
                                                    <span className="highlight-tag">
                                                        <Link to="/RequestPage">

                                                            Workers interested: {job.intrested}

                                                        </Link>

                                                    </span>
                                                </div>
                                            </div>
                                            <button className="btn-outline-action" onClick={() => {
                                                console.log("JOB ID:", job.jobId);
                                                setSelectedJobId(job.jobId); setShowViewJob(true)
                                            }}>
                                                View post
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            )}
                            {showViewJob && (<ViewJobModal
                                jobId={selectedJobId}
                                role={localStorage.getItem("role")}
                                onClose={() => {
                                    setShowViewJob(false);
                                    setSelectedJobId(null);

                                }}
                                onReload={() => loadHomePage()}


                            />)}
                        </section>


                        {/* 4. Pending Requests */}
                        <section className="dashboard-card">
                            <div className="section-card-header">
                                <h2>Pending Worker Requests</h2>
                            </div>
                            {pendingRequests.length === 0 ? (
                                <p className="empty-state-text">No pending worker requests at the moment.</p>
                            ) : (
                                <div className="requests-list">
                                    {pendingRequests.map((req) => (
                                        <div key={req.id} className="worker-request-card">
                                            <div className="worker-info-row">
                                                <div className="worker-avatar-sm">{req.name.charAt(0)}</div>
                                                <div>
                                                    <h4>{req.name}</h4>
                                                    <p>🔧 {req.skill} &nbsp;|&nbsp; ⭐ {req.rating}</p>
                                                </div>
                                            </div>
                                            <div className="worker-actions-row">
                                                <button className="btn-text-action" onClick={() => navigate(`/worker-profile/${req.id}`)}>
                                                    View Profile
                                                </button>
                                                <button className="btn-success-action" onClick={() => handleAcceptRequest(req.id)}>
                                                    Accept
                                                </button>
                                                <button className="btn-danger-action" onClick={() => handleRejectRequest(req.id)}>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* 6. Job History */}
                        <section className="dashboard-card">
                            <div className="section-card-header">
                                <h2>Recent Job History</h2>
                            </div>
                            <div className="history-list">
                                {jobHistory.map((item) => (
                                    <div key={item.id} className="history-item" onClick={() => navigate(`/job-details/${item.id}`)}>
                                        <div className="history-left">
                                            <span className="check-icon">✓</span>
                                            <div>
                                                <h4>{item.title}</h4>
                                                <span className="history-date">{item.date}</span>
                                            </div>
                                        </div>
                                        <span className="history-amount">{item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Right Column: Current Job Status */}
                    <div className="dashboard-right-column">

                        {/* 5. Current Job */}
                        {currentJob && (
                            <section className="dashboard-card highlight-border">
                                <div className="section-card-header">
                                    <h2>Current Job in Progress</h2>
                                </div>
                                <div className="current-job-content">
                                    <h3>🔨 {currentJob.title}</h3>
                                    <div className="current-job-details">
                                        <p><strong>Worker:</strong> {currentJob.workerName} ⭐ {currentJob.workerRating}</p>
                                        <p><strong>Status:</strong> <span className="status-pill">{currentJob.status}</span></p>
                                        <p><strong>Location:</strong> {currentJob.location}</p>
                                    </div>
                                    <div className="current-job-actions">
                                        <button className="btn-primary-action" onClick={() => alert("Connecting to worker...")}>
                                            Contact Worker
                                        </button>
                                        <button className="btn-secondary-action" onClick={() => navigate("/current-job")}>
                                            View Job Details
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}

export default HomePageCustomer;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./Css/HomePage.css";
import ViewJobModal from "./ViewJobModal";

function HomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("SkillMan");
  const [rating, setRating] = useState(4.8);
  const [requests, setRequests] = useState(3);
  const [currentJobs, setCurrentJobs] = useState(1);
  const [completedJobs, setCompletedJobs] = useState(12);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showViewJobModal, setshowViewJobModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // State for nearby jobs list
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  const getAppliedJobs = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/job/getAppliedJobs",
        {
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setApplications(data.applications || []);
      } else {
        console.log("some problem occurred!");
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      const token = localStorage.getItem("token");

      try {
        const jobsRes = await fetch(
          "http://localhost:8080/api/job/getNearbyJobs",
          {
            headers: {
              "Authorization": "Bearer " + token
            }
          }
        );

        const jobsData = await jobsRes.json();
        if (jobsRes.ok) {
          setNearbyJobs(jobsData.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
        setLoadingNearby(false);
      }
    };

    fetchHomeData();
    getAppliedJobs();
  }, []);

  function getTimeAgo(created_at) {
    const created_time = new Date(created_at);
    const currentTime = new Date();

    const difference_time = currentTime - created_time;

    const sec = Math.floor(difference_time / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);

    if (sec < 60) {
      return "just now";
    }
    if (min < 60) {
      return `${min} minute${min > 1 ? "s" : ""} ago`;
    }
    if (hour < 24) {
      return `${hour} hour${hour > 1 ? "s" : ""} ago`;
    }
    if (day < 7) {
      return `${day} day${day > 1 ? "s" : ""} ago`;
    }
  }

  // Toggle availability handler
  const handleAvailabilityToggle = async () => {
    const nextStatus = !available;
    setAvailable(nextStatus);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        `http://localhost:8080/api/labourer/update-availability/${nextStatus}/${userId}`,
        {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (response.ok) {
        if (nextStatus) {
          alert("You are now available for work.");
        } else {
          alert("You are offline now.");
        }
      } else {
        alert("Something went wrong updating availability.");
      }
    } catch (error) {
      console.error("Availability toggle error:", error);
    }
  };

  if (loading) {
    return (
      <div className="homepage-wrapper">
        <Navigation />
        <div className="homepage-loader">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="homepage-wrapper">
      <Navigation />

      <div className="homepage-container">
        {/* Welcome & Status Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>Welcome back, {firstName}! 👋</h1>
            <p>Here is what is happening with your work dashboard today.</p>
          </div>

          <div className="availability-card-toggle">
            <span className="availability-label">Work Status:</span>
            <button
              className={`status-toggle-btn ${available ? "active" : "offline"}`}
              onClick={handleAvailabilityToggle}
            >
              <span className="dot"></span>
              {available ? "Available for Work" : "Offline"}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {/* Rating Card */}
          <div className="metric-card rating-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-content">
              <span className="metric-title">Overall Rating</span>
              <h2 className="metric-value">
                {rating} <span className="metric-sub">/ 5.0</span>
              </h2>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="metric-card">
            <div className="metric-icon bg-yellow">⏳</div>
            <div className="metric-content">
              <span className="metric-title">Pending Requests</span>
              <h2 className="metric-value">{requests}</h2>
            </div>
          </div>

          {/* Current Jobs Card */}
          <div className="metric-card">
            <div className="metric-icon bg-blue">🔨</div>
            <div className="metric-content">
              <span className="metric-title">Current Jobs</span>
              <h2 className="metric-value">{currentJobs}</h2>
            </div>
          </div>

          {/* Completed Jobs Card */}
          <div className="metric-card">
            <div className="metric-icon bg-green">✅</div>
            <div className="metric-content">
              <span className="metric-title">Completed Jobs</span>
              <h2 className="metric-value">{completedJobs}</h2>
            </div>
          </div>
        </div>

        {/* Dynamic Sections Grid (Side by Side) */}
        <div className="dashboard-sections">

          {/* Nearby Jobs Available Section (Side-by-Side Left) */}
          <div className="section-card nearby-jobs-card">
            <div className="section-header-row">
              <h3>📍 Nearby Jobs Available</h3>
              <button className="text-link-btn" onClick={() => navigate("/all-jobs")}>
                View All
              </button>
            </div>

            {loadingNearby ? (
              <p className="empty-text">Searching for jobs near your location...</p>
            ) : nearbyJobs.length === 0 ? (
              <p className="empty-text">No open jobs found in your area right now.</p>
            ) : (
              <div className="nearby-jobs-list">
                {nearbyJobs.slice(0, 3).map((job) => {
                  const currentJobId = job.jobId;
                  const application = applications.find(
                    (app) => app.jobid == currentJobId || app.jobId == currentJobId
                  );

                  const rawStatus = application?.status ? application.status.toLowerCase() : "pending";
                  const statusClass = rawStatus.includes("accept") || rawStatus.includes("approv")
                    ? "status-accepted"
                    : rawStatus.includes("reject")
                    ? "status-rejected"
                    : "status-pending";

                  return (
                    <div key={currentJobId} className="nearby-job-item">
                      <div className="job-info-preview">
                        <h4>🔨 {job.jobTitle}</h4>
                        <p className="job-location-text">
                          📍 {job.location} &nbsp;|&nbsp; ₹{job.budget} &nbsp;|&nbsp; {getTimeAgo(job.created_at)}
                        </p>
                      </div>

                      {application ? (
                        <div className="application-status-group">
                          <span className="submitted-badge">✓ Submitted</span>
                          <span className={`status-badge ${statusClass}`}>
                            {application.status || "Pending"}
                          </span>
                        </div>
                      ) : (
                        <button
                          className="action-btn sm"
                          onClick={() => {
                            setSelectedJobId(currentJobId);
                            setshowViewJobModal(true);
                          }}
                        >
                          View & Apply
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Job Details Card (Side-by-Side Right) */}
          <div className="section-card active-job-card">
            <h3>Active Job Details</h3>
            <p className="empty-text">You are currently assigned to {currentJobs} ongoing task.</p>
            <button className="action-btn outline" onClick={() => alert("Navigate to Your Jobs page")}>
              Manage Current Jobs
            </button>
          </div>

        </div>

        {/* View Job Modal */}
        {showViewJobModal && (
          <ViewJobModal
            jobId={selectedJobId}
            role={localStorage.getItem("role")}
            onClose={() => setshowViewJobModal(false)}
            onReload={() => {
              getAppliedJobs();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
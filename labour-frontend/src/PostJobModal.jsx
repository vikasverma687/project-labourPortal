import React, { useState } from "react";
import "./Css/PostJobModal.css";
import { useNavigate } from "react-router-dom";

function PostJobModal({ onClose , onDone }) {

    const [jobTitle, setJobTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [requiredSkills, setSkills] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [preferred_date, setDate] = useState("");
    const [budget, setBudget] = useState("");
    const [urgency, setUrgency] = useState("NORMAL");
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const JobData = {
            jobTitle,
            category,
            description,
            requiredSkills,
            location,
            phone,
            preferred_date,
            budget,
            urgency
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/job/create-job-post", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                method: "POST",

                body: JSON.stringify(JobData)
            })

            if (response.ok) {
                setShowSuccess(true);

            } else {
                alert("some problem occured while posting your job?")
            }

        } catch {
            console.log("server error, or problem in frontend?")
        }

    };

    return (
        <div className="post-job-overlay">

            <div className="post-job-modal">

                {/* Header */}
                <div className="post-job-header">
                    <h2>Post a Job</h2>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Bathroom Plumbing"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Painting">Painting</option>
                            <option value="Masonry">Masonry</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Gardening">Gardening</option>
                            <option value="Welding">Welding</option>
                            <option value="HVAC">HVAC</option>
                            <option value="Roofing">Roofing</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            placeholder="Describe the work you need..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Required Skills</label>

                        <input
                            type="text"
                            placeholder="e.g. Pipe Repair, Bathroom Fitting"
                            value={requiredSkills}
                            onChange={(e) => setSkills(e.target.value)}
                        />

                        <small>
                            Separate multiple skills with commas.
                        </small>
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                placeholder="e.g. Bhopal"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>phone number</label>

                            <input
                                type="text"
                                placeholder="e.g. 462001"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Preferred Date</label>

                            <input
                                type="date"
                                value={preferred_date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Budget (₹)</label>

                            <input
                                type="number"
                                placeholder="e.g. 2000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                min="0"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Urgency</label>

                        <div className="urgency-options">

                            <label>
                                <input
                                    type="radio"
                                    value="NORMAL"
                                    checked={urgency === "NORMAL"}
                                    onChange={(e) => setUrgency(e.target.value)}
                                />
                                Normal
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="URGENT"
                                    checked={urgency === "URGENT"}
                                    onChange={(e) => setUrgency(e.target.value)}
                                />
                                Urgent
                            </label>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="post-job-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="post-btn"
                        >
                            Post Job
                        </button>

                    </div>

                </form>
                {showSuccess && (
                    <div className="success-overlay">

                        <div className="success-popup">

                            <div className="success-icon">
                                ✓
                            </div>

                            <h2>Job Posted Successfully!</h2>

                            <p>Your job has been posted successfully.</p>

                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    onClose();
                                    onDone();
                                }}
                            >
                                OK
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default PostJobModal;
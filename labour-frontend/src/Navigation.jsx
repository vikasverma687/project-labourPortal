import { Link, useNavigate } from "react-router-dom";
import "./Css/Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = (e) => {
    // Clear localStorage token & userId on logout
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Standard Link behavior will navigate to /Login, but this ensures cleanup
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-logo">🛠️</span>
        <span className="brand-name">LabourPortal</span>
      </div>

      <div className="navbar-links">
          <Link to="/HomePage" className="nav-link">
            HomePage
          </Link>
        

          <Link to="/LabourerProfileView" className="nav-link">
            Profile
          </Link>

        <Link to="/jobs" className="nav-link">
          Your Jobs
        </Link>
        <Link to="/History" className="nav-link">
          History
        </Link>
      </div>

      <div className="navbar-actions">
        <Link to="/Login" className="logout-btn" onClick={handleLogout}>
          Log Out
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
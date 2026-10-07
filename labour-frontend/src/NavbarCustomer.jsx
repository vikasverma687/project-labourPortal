import { Link } from "react-router-dom";
import "./Css/NavbarCustomer.css";

function NavbarCustomer(){

    const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
};
    
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-logo">🛠️</span>
        <span className="brand-name">LabourPortal</span>
      </div>

      <div className="navbar-links">
          <Link to="/HomePageCustomer" className="nav-link">
            HomePage
          </Link>
        

          <Link to="/CustomerProfileView" className="nav-link">
            Profile
          </Link>

          
          <Link to="/RequestPage" className="nav-link">
            Requests
          </Link>

        <Link to="/MyJobs" className="nav-link">
          my Jobs
        </Link>
        <Link to="/messages" className="nav-link">
          messages
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
export default NavbarCustomer;
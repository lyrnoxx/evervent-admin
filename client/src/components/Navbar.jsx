import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <h1>User RBAC</h1>
      <nav>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {isAuthenticated && <span className="badge">{user.role}</span>}
        {isAuthenticated && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

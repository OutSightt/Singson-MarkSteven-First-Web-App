import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/client";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const loggedIn = Boolean(localStorage.getItem("token")) && user;

  // keep the bar in sync when the user logs in/out or edits their profile
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("userhub:session", sync);
    return () => window.removeEventListener("userhub:session", sync);
  }, []);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to={loggedIn ? "/dashboard" : "/login"} className="brand">
          <span className="brand-mark">U</span> UserHub
        </Link>

        {loggedIn ? (
          <nav className="nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">My Profile</NavLink>
            {user.role === "ADMIN" && <NavLink to="/admin/users">Users</NavLink>}
            <span className="chip">
              <span className="avatar">{user.fullName?.charAt(0).toUpperCase()}</span>
              <span className="chip-name">{user.fullName}</span>
              <span className={`badge ${user.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>{user.role}</span>
            </span>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>Logout</button>
          </nav>
        ) : (
          <nav className="nav">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

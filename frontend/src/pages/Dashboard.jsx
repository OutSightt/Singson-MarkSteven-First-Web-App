import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { clearSession, logout } from "../api/client";

export default function Dashboard() {
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setInfo(res.data))
      .catch(() => {
        clearSession();
        navigate("/login");
      });
  }, [navigate]);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!info) return <main className="page"><p className="muted">Loading...</p></main>;

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Welcome, {info.fullName}!</h1>
          <p className="muted">{info.email}</p>
        </div>
        <span className={`badge badge-lg ${info.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>{info.role}</span>
      </div>

      <div className="grid-3">
        <div className="card stat">
          <div className="stat-label">Member since</div>
          <div className="stat-value">{info.memberSince}</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Total users</div>
          <div className="stat-value">{info.totalUsers}</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Your role</div>
          <div className="stat-value">{info.role}</div>
        </div>
      </div>

      <div className="actions">
        <Link to="/profile" className="btn btn-primary">Edit my profile</Link>
        {info.role === "ADMIN" && <Link to="/admin/users" className="btn btn-outline">View all users</Link>}
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </main>
  );
}

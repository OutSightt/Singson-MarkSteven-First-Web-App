import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearSession, errorMessage } from "../api/client";

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/dashboard/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          clearSession();
          navigate("/login");
        } else if (err.response?.status === 403) {
          navigate("/dashboard");        // not an admin
        } else {
          setError(errorMessage(err));
        }
      });
  }, [navigate]);

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>All users</h1>
          <p className="muted">Admin only. Every registered account.</p>
        </div>
        {users && <span className="badge badge-lg badge-user">{users.length} total</span>}
      </div>

      {error && <p className="error">{error}</p>}
      {!users && !error && <p className="muted">Loading...</p>}

      {users && (
        <div className="card table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td className="strong">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>{u.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

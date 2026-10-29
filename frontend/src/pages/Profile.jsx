import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearSession, errorMessage, saveUser } from "../api/client";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setMe(res.data);
        setFullName(res.data.fullName);
      })
      .catch(() => {
        clearSession();
        navigate("/login");
      });
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const { data } = await api.put("/users/me", { fullName });
      setMe(data);
      setFullName(data.fullName);
      saveUser(data);                       // keep the navbar and localStorage in sync
      setMessage("Profile updated successfully.");
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession();
        navigate("/login");
      } else {
        setError(errorMessage(err, "Could not update your profile"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (!me) return <main className="page"><p className="muted">Loading...</p></main>;

  return (
    <main className="page narrow">
      <div className="page-head">
        <div>
          <h1>My profile</h1>
          <p className="muted">Update your full name.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card form-card">
        <label>Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} required />

        <label>Email</label>
        <input value={me.email} disabled />

        <label>Role</label>
        <input value={me.role} disabled />

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { saveSession } from "../api/client";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.message;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveSession(data.token, data.user);          // token + user -> localStorage
      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? "Invalid email or password" : "Cannot reach the server. Is the backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <form onSubmit={onSubmit} className="card auth-card">
        <div className="auth-head">
          <div className="brand-mark big">U</div>
          <h2>Welcome back</h2>
          <p className="muted">Log in to your UserHub account</p>
        </div>

        {notice && <p className="success">{notice}</p>}

        <label>Email</label>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />

        <label>Password</label>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="center small">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}

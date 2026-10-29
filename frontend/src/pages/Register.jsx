import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/client";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login", { state: { message: "Account created! You can log in now." } });
    } catch (err) {
      setError(errorMessage(err, "Check your inputs"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <form onSubmit={onSubmit} className="card auth-card">
        <div className="auth-head">
          <div className="brand-mark big">U</div>
          <h2>Create an account</h2>
          <p className="muted">Join UserHub in a few seconds</p>
        </div>

        <label>Full name</label>
        <input name="fullName" placeholder="Full name" value={form.fullName} onChange={onChange} required />

        <label>Email</label>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="At least 8 characters"
          minLength={8}
          value={form.password}
          onChange={onChange}
          required
        />

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="center small">
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

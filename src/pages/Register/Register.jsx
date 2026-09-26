import { useState } from "react";
import "../Login/Login.css";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const APP_NAME = "Library";

export default function Register() {
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!surname.trim() || !firstName.trim() || !email.trim() || !password) {
      setError("Surname, first name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname,
          firstName,
          middleName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Try again.");
        return;
      }

      setSuccess("Registration successful. You can now log in.");
      setSurname("");
      setFirstName("");
      setMiddleName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Could not reach the server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <header className="topbar">
        <a className="brand" href="/">
          <img src="/logo.svg" alt="" width="20" height="20" />
          <span>{APP_NAME}</span>
        </a>

        <div className="topbar__signup">
          <span>Already have an account?</span>
          <Link className="button" to="/login">
             Log in
          </Link>
        </div>
      </header>

      <main className="login-main">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h1>Sign up</h1>

          <div className="field">
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              placeholder="Enter your surname"
              autoComplete="family-name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="middleName">Middle name (optional)</label>
            <input
              id="middleName"
              type="text"
              placeholder="Enter your middle name"
              autoComplete="additional-name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="help" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="button button--block"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </main>
    </div>
  );
}
import { useState } from "react";
import "./Login.css";
import { Eye, EyeOff } from "lucide-react";

// Change this one line to rename the system on this page.
const APP_NAME = "Library";

export default function Login() {
  // Each piece of form data lives in "state". When it changes, React re-renders.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    // Stop the browser from reloading the page when the form is submitted.
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: send { email, password } to the Express backend here.
      // For now we only log it, so we can check the form works.
      console.log("Login attempt:", { email });
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
          <span>Don&rsquo;t have an account?</span>
          <a className="button" href="/register">
            Sign up
          </a>
        </div>
      </header>

      <main className="login-main">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h1>Log in</h1>

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
                placeholder="Enter your password"
                autoComplete="current-password"
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

          <button
            type="submit"
            className="button button--block"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="help">
            Forgot your password? Ask the librarian to reset it.
          </p>
        </form>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      return setError("Email and password are required");
    }

    if (!formData.email.endsWith("@ufl.edu")) {
      return setError("Must use a UF email");
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("fullName", response.data.fullName);
      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Error logging in");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <span className="auth-brand">GatorGrind</span>
          <h1>
            Welcome
            <br />
            back.
          </h1>
          <p>
            Log in to continue exploring <span className="auth-highlight">affordable, student-friendly services</span> and stay connected with the UF community.
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Log In</h2>
            <p className="auth-subtext">
              Use your UF email and password to continue.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">UF Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your UF email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button className="auth-button" type="submit">
                Log In
              </button>
            </form>

            {error && <p className="auth-message error">{error}</p>}
            {success && <p className="auth-message success">{success}</p>}

            <p className="auth-footer">
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
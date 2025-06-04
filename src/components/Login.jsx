import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("vikas@example.com");
  const [password, setPassword] = useState("Vikas@123");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [err, setErr] = useState("");

  // Validation functions
  const validateUsername = (value) => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 4) {
      return "Username must be at least 4 characters";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setErrors((prev) => ({
      ...prev,
      username: validateUsername(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email: username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(response?.data?.data));
      response?.status === 200 && navigate("/feed");
      setLoginSuccess(true);
      // In a real app, you would handle the authentication here
      console.log("Login successful", response);
    } catch (error) {
      setErr(error?.response.data);
      console.error("Login failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    !errors.username && !errors.password && username && password;

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6">
            Login
          </h2>

          {loginSuccess ? (
            <div className="alert alert-success">
              {/* <CheckCircle2 className="h-6 w-6" /> */}
              <span>Login successful! Redirecting...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`input input-bordered w-full ${
                    errors.username ? "input-error" : ""
                  }`}
                  value={username}
                  onChange={handleUsernameChange}
                />
                {errors.username && (
                  <div className="flex items-center mt-2 text-error text-sm">
                    {/* <AlertCircle className="h-4 w-4 mr-1" /> */}
                    <span>{errors.username}</span>
                  </div>
                )}
              </div>

              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`input input-bordered w-full ${
                    errors.password ? "input-error" : ""
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errors.password && (
                  <div className="flex items-center mt-2 text-error text-sm">
                    {/* <AlertCircle className="h-4 w-4 mr-1" /> */}
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
              {err && <p className="text-red-300">{err}</p>}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="divider mt-6">OR</div>

          <div className="text-center">
            <p className="text-sm">Don't have an account?</p>
            <button className="btn btn-link">Sign up now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BsEye, BsEyeSlash } from "react-icons/bs";
// import "./Style.css";

const  ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navy = "#001f4d";

  const logoutAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    toast.success("Password changed successfully. Logging out...", {
      autoClose: 2000,
      onClose: () => navigate("/login"),
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8081/api/user/${userId}/change-password`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        }
      );

      logoutAndRedirect();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backg">
      <div className="container-fluid d-flex align-items-center justify-content-center mt-5">
        <ToastContainer position="top-center" />
        <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
          <h4 className="text-center" style={{ color: navy }}>
            Change Your Password
          </h4>
          <hr />
          <form onSubmit={handleReset}>
            {/* Current Password */}
            <div className="mb-3 mt-3">
              <label>Current Password</label>
              <div className="input-group">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label>Confirm New Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: navy }}
              className="btn w-100 text-light"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { prodUrl } from "../Constants";
// import "react-toastify/dist/ReactToastify.css";
// import { BsEye, BsEyeSlash } from "react-icons/bs";
// import "./Style.css";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [processing, setProcessing] = useState(false);


  const navy = "#001f4d";

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
    setProcessing(true);
    try {
      setLoading(true);
      const res = await axios.post(
        `${prodUrl}user/${userId}/change-password`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        }
      );
      if (res.data.code === 200) {
        setProcessing(false);
        toast.success("Change Password Successful");
      } else {
        toast.error("Failed to change Password!");
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  return (

    <>
      <div>
        {processing && (
          <div className="overlay-screen">
            <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="3" />
          </div>
        )}
      </div>


      <ToastContainer />
      <div className="card form-container m-auto p-3 ">
        <form className="p-1" onSubmit={handleReset}>
          {/* Current Password */}
          <div className="mb-3">
            <label htmlFor="currentpassword">Current Password</label>
            <div className="password-input-wrapper">
              <input
                id="currentpassword"
                type={showCurrentPassword ? "text" : "password"}
                className="form-control password-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="enter current password"
                required />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? (
                  <i className="pi pi-eye-slash"></i>
                ) : (
                  <i className="pi pi-eye"></i>
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label htmlFor="newpassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                id="newpassword"
                type={showNewPassword ? "text" : "password"}
                className="form-control password-input"
                value={newPassword}
                placeholder="enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                required />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <i className="pi pi-eyeslash" ></i> : <i className="pi pi-eye" ></i>}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmpassword">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input
                id="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control password-input"
                value={confirmNewPassword}
                placeholder="enter confirm new password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <i className="pi pi-eyeslash" ></i> : <i className="pi pi-eye" ></i>}
              </button>
            </div>
          </div>
          <hr className="no-spacing" />
          <div className="d-flex flex-row justify-content-end">
            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={loading}
            >
              {loading ? "processing" : "Update"}
            </button>
          </div>

        </form>
      </div>

    </>
  );
}

export default ChangePassword;

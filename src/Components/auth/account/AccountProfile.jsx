import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_METHODS, BaseUrl, prodUrl } from "../../Constants";
import { toast, ToastContainer } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import ChangePassword from '../ChangePassword';

const AccountProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [processing, setProcessing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const accountDetails = user?.accountDetails;
  const accountId = user?.accountDetails?.id;
  const userEmail = user?.email;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    alternatePhone: "",
  });


  useEffect(() => {
    if (accountDetails) {
      setFormData({
        firstName: accountDetails.firstName || "",
        lastName: accountDetails.lastName || "",
        phone: accountDetails.phone || "",
        alternatePhone: accountDetails.alternatePhone || "",
      });
    }
  }, [accountDetails]);

  // field changes
  const onFieldhandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAddress = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await fetch(`${prodUrl}account/account/${accountId}`, {
        method: API_METHODS.put,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.status === 200) {
        setProcessing(false);
        toast.success("Account Details Updated");
      } else {
        toast.error("Failed to Update!");
      }

    } catch (error) {
      setProcessing(false);
      toast.error("something went wrong!");
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
      <div className="container">
        <div className="form-wrapper">
          <div className="d-flex flex-row justify-content-between mb-2 align-items-center">
            <h4 className="page-title">{showPasswordForm ? "Change Password" : "Profile Information"}</h4>

            {!showPasswordForm ? (
              <button
                className="btn btn-secondary mobile-view-btn"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            ) : (
              <button
                className="btn btn-secondary mobile-view-btn"
                onClick={() => setShowPasswordForm(false)}
              >
                View Profile
              </button>
            )}
          </div>
          {
            !showPasswordForm && (
              <div className="form-card">
                <form className="form" onSubmit={updateAddress}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={onFieldhandleChange}
                        placeholder="Enter First Name"
                        className="form-input" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={onFieldhandleChange}
                        placeholder="Enter Last Name"
                        className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="accountEmail"
                      value={userEmail}
                      placeholder="enter email address"
                      disabled
                      className="form-input" />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onFieldhandleChange}
                        placeholder="Enter Phone number"
                        className="form-input" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alternate Phone Number</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={onFieldhandleChange}
                        placeholder="Enter Alternate phone number"
                        className="form-input" />
                    </div>
                  </div>

                  <div className="update-btn-container">
                    <button type="submit" className="submit-btn">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            )
          }


        </div>
      </div>

      {
        showPasswordForm && (
          <ChangePassword />
        )
      }


    </>
  );
};

export default AccountProfile;

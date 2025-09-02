import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_METHODS, BaseUrl } from "../../Constants";

const AccountProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const accountDetails = user?.accountDetails;
  const accountId = user?.accountDetails?.id;
  const userEmail = accountDetails?.accountEmail;

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
    try {
      const res = await fetch(`${BaseUrl}account/account/${accountId}`, {
        method: API_METHODS.put,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.status === 200) {
        alert("Account Details Updated")
      } else {
        alert("Failed to Update!")
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h3 className="page-title">Personal Information</h3>
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
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onFieldhandleChange}
                  placeholder="Enter Last Name"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="accountEmail"
                value={userEmail}
                disabled
                className="form-input"
              />
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
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alternate Phone Number</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={onFieldhandleChange}
                  placeholder="Enter Alternate phone number"
                  className="form-input"
                />
              </div>
            </div>

            <div className="update-btn-container">
              <button type="submit" className="submit-btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;

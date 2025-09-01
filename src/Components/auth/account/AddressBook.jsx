import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit, Trash2, Home, Building } from "lucide-react";
import { API_METHODS, BaseUrl } from "../../Constants";


const AddressBook = () => {
  const { user } = useSelector((state) => state.auth);
  const userAddresses = user?.data?.accountDetails?.addresses;
  const accountId = user?.data?.accountDetails?.id;

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    alterPhone: "",
    addressType: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    isDefault: false,
  });



  useEffect(() => {
    if (user?.data?.accountDetails?.addresses) {
      setAddresses(user.data.accountDetails.addresses);
    } else {
      setAddresses([]);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add Address
  const handleAddAddress = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      alterPhone: "",
      addressType: "Home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowForm(true);
  };

  // Edit Address
  const handleEditAddress = (address) => {
    setFormData(address);
    setEditingAddress(address.addressId);
    setShowForm(true);
  };

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    const updated = addresses.filter((addr) => addr.addressId !== addressId);
    try {
      const res = await fetch(`${BaseUrl}user-address/${addressId}`, {
        method: API_METHODS.delete,
        credentials: "include",
      });
      console.log("res", res);
      if (res.status === 200) {
        setAddresses(updated);
      } else {
        alert("Failed to delete address!")
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Save (Add / Update)
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (editingAddress) {
      // Update existing
      const updated = addresses.map((addr) =>
        addr.addressId === editingAddress ? { ...formData, addressId: editingAddress } : addr
      );
      setAddresses(updated);
      try {
        const res = await fetch(`${BaseUrl}user-address/${editingAddress}`, {
          method: API_METHODS.put,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (res.status === 200) {
          alert("Address Updated")
        } else {
          alert("Failed to Update address!")
        }

      } catch (error) {
        console.error("Error:", error);
      }
      console.log("Updated address:", formData);
    } else {
      // Add new
      const newAddress = {
        ...formData,
      };
      try {
        const res = await fetch(`${BaseUrl}user-address/${accountId}`, {
          method: API_METHODS.post,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        });
        if (res.status === 201) {
          setAddresses([...addresses, newAddress]);
          setShowForm(false);
          setEditingAddress(null);
        } else {
          alert("Failed to add address!")
        }

      } catch (error) {
        console.error("Error:", error);
      }
      // TODO: Call backend API for add
      console.log("Added address:", newAddress);
    }


  };

  // Cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="address-container">
      <div className="address-wrapper">
        <div className="address-header">
          <h3>Address Book</h3>
          {!showForm && (
            <button onClick={handleAddAddress} className="add-address-btn">
              <Plus size={16} />
              <span>Add new address</span>
            </button>
          )
          }
        </div>

        {/* Address Form */}
        {showForm ? (
          <div className="form-card">
            <form className="form" onSubmit={handleSaveAddress}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="enter last name"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="enter phone number"
                  />
                </div>


                <div className="form-group">
                  <label>Alternate Phone</label>
                  <input
                    type="tel"
                    name="alterPhone"
                    value={formData.alterPhone}
                    onChange={handleChange}
                    placeholder="enter alternate phone number"
                  />
                </div>

              </div>


              <div className="form-group">
                <label>Address Line 1*</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                  placeholder="enter address line 1"
                />
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="enter address line 2"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="enter city"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="enter state"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="enter country"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="enter pincode"
                  />
                </div>
              </div>



              <div>
                <label>Address Type*</label>
                <div className="d-flex flex-row gap-3 align-items-center mt-2">
                  <label className="d-flex flex-row align-items-center gap-1">
                    <input
                      type="radio"
                      id="home"
                      name="addressType"
                      value="Home"
                      checked={formData.addressType === "Home"}
                      onChange={handleChange}
                    />
                    Home
                  </label>

                  <label className="d-flex flex-row align-items-center gap-1">
                    <input
                      type="radio"
                      id="work"
                      name="addressType"
                      value="Work"
                      checked={formData.addressType === "Work"}
                      onChange={handleChange}
                    />
                    Work
                  </label>

                  <label className="d-flex flex-row align-items-center gap-1">
                    <input
                      type="radio"
                      id="other"
                      name="addressType"
                      value="Other"
                      checked={formData.addressType === "Other"}
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              </div>



              <div>
                <div className="d-flex flex-row justify-content-start">
                  <div htmlFor="isDefault" className="d-flex flex-row justify-content-start align-items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                    />
                    Default Address
                  </div>

                </div>
              </div>




              <div className="form-actions">

                <button type="button" onClick={handleCancel} className="btn btn-outline-danger">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingAddress ? "Update Address" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Address Cards
          <div className="address-grid">
            {addresses.map((address) => (
              <div key={address.addressId} className="address-card">
                <div className="address-card-header">
                  <div className="address-card-title">
                    <h3>
                      {address.firstName} {address.lastName}
                    </h3>
                    <span className="address-type">
                      {address.addressType === "Home" ? <Home size={12} /> : <Building size={12} />}
                      <span>{address.addressType}</span>
                    </span>
                  </div>
                </div>

                {address.default && <div className="default-badge">Default</div>}

                <div className="address-details">
                  <p>{address.addressLine1}</p>
                  <p>{address.addressLine2}</p>
                  <p>
                    {address.city}, {address.state}
                  </p>
                  <p>
                    {address.country} - {address.pincode}
                  </p>
                </div>

                <div className="address-phone">
                  <p>Phone: {address.phone}</p>
                </div>

                <div className="address-actions">
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="edit-btn"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.addressId)}
                      className="delete-btn"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {
          !showForm && (
            <div className="mobile-add">
              <button onClick={handleAddAddress} className="mobile-add-btn"> <Plus size={16} />
                <span>Add new address</span>
              </button>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default AddressBook;

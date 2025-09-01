import axios from "axios";
import React, { useEffect, useState } from "react";
import { RAZORPAY_KEY, calculateCartItemTotals, initialAddressState, serverPort } from "../Constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const Checkout = () => {
    const navigate = useNavigate();
    const [cartList, setCartList] = useState([]);
    const [cartItemsIds, setCartItemsIds] = useState([]);
    const [termsChecked, setTermsChecked] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({});
    const [selectedAddresType, setSelectedAddressType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editingAddressData, setEditingAddressData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [newAddress, setNewAddress] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        alterPhone: "",
        addressType: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        isDefault: false,
    });
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [accountId, setAccountId] = useState(null);
    const [mode, setMode] = useState("existing");
    const { user } = useSelector((state) => state.auth);
    const userId = user?.data?.id;
    const { items, total, itemCount, loading } = useSelector((state) => state.cart);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/account/user/${userId}`);

            const accountData = response.data?.data;
            const addressList = accountData?.addresses;
            console.log("address", addressList);

            setAccountId(accountData.id);
            setAddresses(addressList);

            if (addressList.length > 0) {
                setSelectedAddressId(addressList[0].addressId);
            } else {
                toast.warn("No addresses found. Please add an address.");
            }
        } catch (error) {
            console.error("Error loading addresses", error);
            toast.error("Failed to load addresses");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingAddressId(null);
        setNewAddress(initialAddressState);
        setFormErrors({});
    };

    useEffect(() => {
        setCartList(items);
        const ids = items.map((item) => item.cartItemId);
        setCartItemsIds(ids);
    }, [items]);

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [user])

    const addNewAddress = async () => {
        try {
            const res = await axios.post(
                `http://localhost:8081/api/user-address/${accountId}`,
                newAddress,
            );
            if (res.data.code === 201) {
                fetchAddresses();
                setNewAddress(initialAddressState);
                setIsEditing(false);
            } else {
                toast.error("Failed to add address", {
                    autoClose: 1000,
                });
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    const openUpdateAddress = (addressId) => {
        const addressToEdit = addresses.find((addr) => addr.addressId === addressId);
        if (addressToEdit) {
            setNewAddress({ ...addressToEdit });
            setCurrentAddress(addressToEdit);
            setEditingAddressId(addressId);
            setEditingAddressData({ ...addressToEdit });
            setIsEditing(true);
            setSelectedAddressType(addressToEdit.addressType)
        }
    };

    const updateAddress = async () => {

        const mergedPayload = { ...editingAddressData };
        Object.keys(newAddress).forEach((key) => {
            if (key !== "addressId" && newAddress[key] !== editingAddressData[key]) {
                mergedPayload[key] = newAddress[key];
            }
        });
        const hasChanges = Object.keys(newAddress).some(
            (key) => key !== "addressId" && newAddress[key] !== editingAddressData[key]
        );

        if (!hasChanges) {
            toast.warning("Please update any field!");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:8081/api/user-address/${selectedAddressId}`, mergedPayload);
            if (res.data.code === 200) {
                toast.success("Address Updated successfully!")
                setIsEditing(false);
                setEditingAddressData({});
                setEditingAddressId(null);
                setNewAddress(initialAddressState);
                fetchAddresses();
            } else {
                toast.error("Failed to Update address!")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    const addressSelection = (label) => {
        setSelectedAddressType(label);
        setNewAddress((prev) => ({
            ...prev,
            addressType: label,
        }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const calculateCartTotals = (items) => {
        let subTotal = 0;
        let gst = 0;
        let totalQuantity = 0;

        items.forEach((item) => {
            const { subTotal: itemSub, gst: itemGst } = calculateCartItemTotals(item);

            subTotal += itemSub;
            gst += itemGst;
            totalQuantity += item?.cartQuantity;
        });
        const shippingCharges = itemCount >= 2 ? 0 : 50;


        const totalAmount = subTotal + gst + shippingCharges;

        return { subTotal, gst, shippingCharges, totalAmount };
    };
    const { subTotal, gst, shippingCharges, totalAmount } = calculateCartTotals(items);


    const addNewPayment = async () => {
        const res = await loadRazorpayScript();
        if (!res) {
            toast.error("Razorpay SDK failed to load.");
            return;
        }

        if (!accountId || !selectedAddressId) {
            toast.error("Missing account or address information");
            return;
        }

        const paymentPayload = {
            amount: totalAmount,
            currency: "INR",
            gstAmount: gst,
            shippingPrice: shippingCharges,
            cartItemIds: cartItemsIds,
        };

        try {
            const razorpayRes = await axios.post(
                `http://localhost:8081/api/payment/create/${accountId}/${selectedAddressId}`,
                paymentPayload,
            );

            const payment = razorpayRes.data.data;
            const options = {
                key: RAZORPAY_KEY,
                amount: payment.amount,
                currency: payment.currency,
                name: "Indian Book Of Records",
                description: "Order Payment",
                order_id: payment.razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verifyPayload = {
                            razorpayOrderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            cartItemIds: cartItemsIds,
                            amount: totalAmount,
                            gstAmount: gst,
                            shippingPrice: shippingCharges,
                            currency: payment.currency,
                            receipt: payment.receipt,
                            status: "SUCCESS",
                        };
                        const verifyRes = await axios.post(
                            "http://localhost:8081/api/payment/verify-payment",
                            verifyPayload,
                        );

                        if (verifyRes.status === 200) {
                            // setShowSuccessDialog(true);
                            // setShowSuccessDialog(false);
                            navigate("/account-details");
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (err) {
                        toast.error("Something went wrong!.");
                    }
                },
                prefill: {
                    name: "WeLoveYou",
                    email: "info@weloveyou.in",
                    contact: "7569559184",
                },
                theme: {
                    color: "#528FF0",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err?.response?.data || err.message);
            toast.error("Payment initiation failed.");
        }
    };

    return (
        // < !--Main Content-- >
        <div className="mn-main-content">
            <div className="mn-breadcrumb m-b-30">
                <div className="row">
                    <div className="col-12">
                        <div className="row gi_breadcrumb_inner">
                            <div className="col-md-6 col-sm-12">
                                <h2 className="mn-breadcrumb-title">Checkout Page</h2>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <ul className="mn-breadcrumb-list">
                                    <li className="mn-breadcrumb-item"><a onClick={() => navigate('/')}
                                    >Home</a></li>
                                    <li className="mn-breadcrumb-item active">Checkout Page</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Checkout section --> */}
            <section className="mn-checkout-section p-b-15">
                <h2 className="d-none">Checkout Page</h2>
                <div className="row">
                    <div className="mn-checkout-leftside col-lg-8 col-md-12">

                        <div className="mn-checkout-content">
                            <div className="mn-checkout-inner">
                                {/* <div className="mn-checkout-wrap m-b-30">
                                    <div className="mn-checkout-block mn-check-new">
                                        <h3 className="mn-checkout-title">New Customer</h3>
                                        <div className="mn-check-block-content">
                                            <div className="mn-check-subtitle">Checkout Options</div>
                                            <form action="#">
                                                <span className="mn-new-option">
                                                    <span className="m-b-15">
                                                        <input type="radio" id="account1" name="radio-group" defaultChecked />
                                                        <label htmlFor="account1">Register Account</label>
                                                    </span>
                                                    <span className="m-b-15">
                                                        <input type="radio" id="account2" name="radio-group" />
                                                        <label htmlFor="account2">Guest Account</label>
                                                    </span>
                                                </span>
                                            </form>
                                            <div className="mn-new-desc">By creating an account you will be able to shop
                                                faster,
                                                be up to date on an order's status, and keep track of the orders you
                                                have
                                                previously made.
                                            </div>
                                            <div className="mn-new-btn"><a href="#"
                                                className="mn-btn-2"><span>Continue</span></a></div>

                                        </div>
                                    </div>
                                    <div className="mn-checkout-block mn-check-login">
                                        <h3 className="mn-checkout-title">Returning Customer</h3>
                                        <div className="mn-check-login-form">
                                            <form action="#" method="post">
                                                <span className="mn-check-login-wrap">
                                                    <label>Email Address</label>
                                                    <input type="text" name="name"
                                                        placeholder="Enter your email address" required />
                                                </span>
                                                <span className="mn-check-login-wrap">
                                                    <label>Password</label>
                                                    <input type="password" name="password"
                                                        placeholder="Enter your password" required />
                                                </span>

                                                <span className="mn-check-login-wrap mn-check-login-btn">
                                                    <button className="mn-btn-2" type="submit"><span>Login</span></button>
                                                    <a className="mn-check-login-fp" href="#">Forgot Password?</a>
                                                </span>
                                            </form>
                                        </div>
                                    </div>

                                </div> */}
                                <div className="mn-checkout-wrap m-b-30 padding-bottom-3">
                                    <div className="mn-checkout-block mn-check-bill">
                                        <h3 className="mn-checkout-title">Billing Details</h3>
                                        <div className="mn-bl-block-content">
                                            <div className="mn-check-subtitle">Checkout Options</div>
                                            <span className="mn-bill-option">
                                                <span className="m-b-15">
                                                    <input type="radio" id="bill1" name="radio-group" checked={mode === "existing"}
                                                        onChange={() => {
                                                            setMode("existing");
                                                            setIsEditing(false);
                                                        }
                                                        } />
                                                    <label htmlFor="bill1">I want to use an existing address</label>
                                                </span>
                                                <span className="">
                                                    <input type="radio" id="bill2" name="radio-group"
                                                        checked={mode === "new"}

                                                        onChange={() => {
                                                            setIsEditing(true);
                                                            setEditingAddressId(null);
                                                            setEditingAddressData({});
                                                            setNewAddress(initialAddressState);
                                                            setFormErrors({});
                                                            setMode("new");
                                                        }}
                                                    />
                                                    <label htmlFor="bill2">I want to use new address</label>
                                                </span>
                                            </span>

                                            {/* <div className="">
                                                {(addresses.length === 0 || isEditing) ? (
                                                    <>
                                                        <div className="d-flex flex-row gap-2">
                                                            <form
                                                                // onSubmit={(e) => {
                                                                //     e.preventDefault();
                                                                //     if (isEditing && editingAddressId !== null) {
                                                                //         updateAddress();
                                                                //     } else {
                                                                //         addNewAddress();
                                                                //     }
                                                                // }}
                                                                className="w-100">
                                                                <div className="mn-check-bill-form">
                                                                    <div className="d-flex flex-row">
                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>First Name*</label>
                                                                            <input
                                                                                type="text"
                                                                                name="firstName"
                                                                                value={newAddress.firstName}
                                                                                required
                                                                                onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                                                                                placeholder="Enter your first name" />
                                                                        </span>

                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>Last Name*</label>
                                                                            <input
                                                                                type="text"
                                                                                name="lastName"
                                                                                value={newAddress.lastName}
                                                                                required
                                                                                onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                                                                                placeholder="Enter your last name" />
                                                                        </span>
                                                                    </div>

                                                                    <div className="d-flex flex-row mobile-view">
                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>Phone number *</label>
                                                                            <input
                                                                                type="number"
                                                                                name="phone"
                                                                                required
                                                                                value={newAddress.phone}
                                                                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                                                placeholder="phone number" />
                                                                        </span>

                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>Alternate Phone number</label>
                                                                            <input
                                                                                type="number"
                                                                                name="alterPhone"
                                                                                value={newAddress.alterPhone}
                                                                                onChange={(e) => setNewAddress({ ...newAddress, alterPhone: e.target.value })}
                                                                                placeholder="Alternate phone number" />
                                                                        </span>
                                                                    </div>
                                                                    <span className="mn-bill-wrap">
                                                                        <label>Address Line 1 *</label>
                                                                        <input
                                                                            type="text"
                                                                            name="addressLine1"
                                                                            value={newAddress.addressLine1}
                                                                            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                                                                            required
                                                                            placeholder="Address Line 1" />
                                                                    </span>

                                                                    <span className="mn-bill-wrap">
                                                                        <label>Address Line 2</label>
                                                                        <input
                                                                            type="text"
                                                                            name="addressLine2"
                                                                            value={newAddress.addressLine2}
                                                                            onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                                                                            placeholder="Address Line 2" />
                                                                    </span>
                                                                    <div className="d-flex flex-row">
                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>City *</label>
                                                                            <input
                                                                                type="text"
                                                                                name="city"
                                                                                value={newAddress.city}
                                                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                                                required
                                                                                placeholder="City" />
                                                                        </span>

                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>Post Code</label>
                                                                            <input
                                                                                type="number"
                                                                                name="pincode"
                                                                                value={newAddress.pincode}
                                                                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                                                required
                                                                                placeholder="Post Code" />
                                                                        </span>
                                                                    </div>

                                                                    <div className="d-flex flex-row">
                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>Region State</label>
                                                                            <input
                                                                                type="text"
                                                                                name="state"
                                                                                value={newAddress.state}
                                                                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                                                required
                                                                                placeholder="Region/State" />
                                                                        </span>
                                                                        <span className="mn-bill-wrap mn-bill-half">
                                                                            <label>Country *</label>
                                                                            <input
                                                                                type="text"
                                                                                name="country"
                                                                                value={newAddress.country}
                                                                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                                                required
                                                                                placeholder="Country" />
                                                                        </span>
                                                                    </div>

                                                                    <span>
                                                                        <div >
                                                                            <label>Address Type*</label>
                                                                            <div className="d-flex flex-row gap-3 mb-3 align-items-center address-type-mobile-view">
                                                                                <span>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id="home"
                                                                                        name="addressType"
                                                                                        value="Home"
                                                                                        checked={newAddress.addressType === "Home"}
                                                                                        onChange={(e) => {
                                                                                            setNewAddress({ ...newAddress, addressType: e.target.value });
                                                                                            if (isEditing) {
                                                                                                setEditingAddressData({ ...editingAddressData, addressType: e.target.value });
                                                                                            }
                                                                                        }}

                                                                                    />
                                                                                    <label htmlFor="home">Home</label>
                                                                                </span>
                                                                                <span>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id="work"
                                                                                        name="addressType"
                                                                                        value="Work"
                                                                                        checked={newAddress.addressType === "Work"}
                                                                                        onChange={(e) => {
                                                                                            setNewAddress({ ...newAddress, addressType: e.target.value });
                                                                                            if (isEditing) {
                                                                                                setEditingAddressData({ ...editingAddressData, addressType: e.target.value });
                                                                                            }
                                                                                        }}

                                                                                    />
                                                                                    <label htmlFor="work">Work</label>
                                                                                </span>
                                                                                <span>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id="other"
                                                                                        name="addressType"
                                                                                        value="Other"
                                                                                        checked={newAddress.addressType === "Other"}
                                                                                        onChange={(e) => {
                                                                                            setNewAddress({ ...newAddress, addressType: e.target.value });
                                                                                            if (isEditing) {
                                                                                                setEditingAddressData({ ...editingAddressData, addressType: e.target.value });
                                                                                            }
                                                                                        }}

                                                                                    />
                                                                                    <label htmlFor="other">Other</label>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="d-flex flex-row justify-content-end mb-3">
                                                            <button className="btn btn-outline-danger" onClick={handleCancel} >Cancel</button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (isEditing && editingAddressId !== null) {
                                                                        updateAddress();
                                                                    } else {
                                                                        addNewAddress();
                                                                    }
                                                                }}
                                                                className="btn btn-primary"
                                                            >
                                                                {!isEditing ? "Add Address" : "Update Address"}
                                                            </button>
                                                        </div>
                                                    </>

                                                ) : (
                                                    <form>
                                                        {addresses.map((addr) => (
                                                            <div
                                                                key={addr.addressId}
                                                                className="border p-3 rounded mb-4 position-relative"
                                                                style={{
                                                                    backgroundColor: selectedAddressId === addr.addressId ? "#f0f8ff" : "white",
                                                                }}
                                                            >
                                                                <div style={{ position: "absolute", top: "12px", right: "10px", display: "flex", gap: "8px" }}>
                                                                    <i
                                                                        className="pi pi-pencil"
                                                                        style={{ cursor: "pointer" }}
                                                                        title="Edit"
                                                                        onClick={() => openUpdateAddress(addr.addressId)}
                                                                    ></i>
                                                                </div>

                                                                <div className="d-flex" style={{ alignItems: "start" }}>
                                                                    <input
                                                                        type="radio"
                                                                        id="selectedAddress"
                                                                        name="selectedAddress"
                                                                        className="form-check-input me-3"
                                                                        checked={selectedAddressId === addr.addressId}
                                                                        onChange={() => setSelectedAddressId(addr.addressId)}
                                                                    />
                                                                    <label htmlFor="selectedAddress"></label>
                                                                    <div>
                                                                        <strong>{addr.firstName} {addr.lastName}</strong>
                                                                        <span className="badge bg-secondary ms-2">{addr.addressType}</span>
                                                                        <div>{addr.addressLine1}, {addr.addressLine2}</div>
                                                                        <div>{addr.city}, {addr.state}, {addr.country} - {addr.pincode}</div>
                                                                        <div>Phone: {addr.phone}</div>
                                                                        {addr.alterPhone && <div>Alternate Phone: {addr.alterPhone}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </form>
                                                )}
                                            </div> */}

                                            <div className="">
                                                {(addresses.length === 0 || isEditing) ? (
                                                    <div className="d-flex flex-row gap-2">
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                if (isEditing && editingAddressId !== null) {
                                                                    updateAddress();
                                                                } else {
                                                                    addNewAddress();
                                                                }
                                                            }}
                                                            className="w-100"
                                                        >
                                                            <div className="container-fluid">
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                                                        <input
                                                                            type="text"
                                                                            id="firstName"
                                                                            name="firstName"
                                                                            className={`form-control ${formErrors.firstName ? "is-invalid" : ""}`}
                                                                            placeholder="Enter first name"
                                                                            value={newAddress.firstName}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, firstName: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.firstName && (
                                                                            <div className="invalid-feedback d-block">{formErrors.firstName}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                                                        <input
                                                                            type="text"
                                                                            id="lastName"
                                                                            name="lastName"
                                                                            className={`form-control ${formErrors.lastName ? "is-invalid" : ""}`}
                                                                            placeholder="Enter last name"
                                                                            value={newAddress.lastName}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, lastName: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.lastName && (
                                                                            <div className="invalid-feedback d-block">{formErrors.lastName}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="addressLine1" className="form-label">Address Line 1</label>
                                                                        <input
                                                                            type="text"
                                                                            id="addressLine1"
                                                                            name="addressLine1"
                                                                            className={`form-control ${formErrors.addressLine1 ? "is-invalid" : ""}`}
                                                                            placeholder="Enter address line 1"
                                                                            value={newAddress.addressLine1}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, addressLine1: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.addressLine1 && (
                                                                            <div className="invalid-feedback d-block">{formErrors.addressLine1}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="addressLine2" className="form-label">Address Line 2</label>
                                                                        <input
                                                                            type="text"
                                                                            id="addressLine2"
                                                                            name="addressLine2"
                                                                            className={`form-control ${formErrors.addressLine2 ? "is-invalid" : ""}`}
                                                                            placeholder="Enter address line 2"
                                                                            value={newAddress.addressLine2}
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, addressLine2: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.addressLine2 && (
                                                                            <div className="invalid-feedback d-block">{formErrors.addressLine2}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="city" className="form-label">City</label>
                                                                        <input
                                                                            type="text"
                                                                            id="city"
                                                                            name="city"
                                                                            className={`form-control ${formErrors.city ? "is-invalid" : ""}`}
                                                                            placeholder="Enter city"
                                                                            value={newAddress.city}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, city: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.city && (
                                                                            <div className="invalid-feedback d-block">{formErrors.city}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="state" className="form-label">State</label>
                                                                        <input
                                                                            type="text"
                                                                            id="state"
                                                                            name="state"
                                                                            className={`form-control ${formErrors.state ? "is-invalid" : ""}`}
                                                                            placeholder="Enter state"
                                                                            value={newAddress.state}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, state: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.state && (
                                                                            <div className="invalid-feedback d-block">{formErrors.state}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="country" className="form-label">Country</label>
                                                                        <input
                                                                            type="text"
                                                                            id="country"
                                                                            name="country"
                                                                            className={`form-control ${formErrors.country ? "is-invalid" : ""}`}
                                                                            placeholder="Enter country"
                                                                            value={newAddress.country}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, country: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.country && (
                                                                            <div className="invalid-feedback d-block">{formErrors.country}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="pincode" className="form-label">Pincode</label>
                                                                        <input
                                                                            type="text"
                                                                            id="pincode"
                                                                            name="pincode"
                                                                            className={`form-control ${formErrors.pincode ? "is-invalid" : ""}`}
                                                                            placeholder="Enter pincode"
                                                                            value={newAddress.pincode}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, pincode: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.pincode && (
                                                                            <div className="invalid-feedback d-block">{formErrors.pincode}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="phone" className="form-label">Phone</label>
                                                                        <input
                                                                            type="number"
                                                                            id="phone"
                                                                            name="phone"
                                                                            className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                                                                            placeholder="Enter phone number"
                                                                            value={newAddress.phone}
                                                                            required
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, phone: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.phone && (
                                                                            <div className="invalid-feedback d-block">{formErrors.phone}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <label htmlFor="alterPhone" className="">Alternate Phone</label>
                                                                        <input
                                                                            type="text"
                                                                            id="alterPhone"
                                                                            name="alterPhone"
                                                                            className={` ${formErrors.alterPhone ? "is-invalid" : ""}`}
                                                                            placeholder="Enter alternate phone"
                                                                            value={newAddress.alterPhone}
                                                                            onChange={(e) =>
                                                                                setNewAddress({ ...newAddress, alterPhone: e.target.value })
                                                                            }
                                                                        />
                                                                        {formErrors.alterPhone && (
                                                                            <div className="invalid-feedback d-block">{formErrors.alterPhone}</div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex flex-row justify-content-end mt-4 mb-3">
                                                                    <button type="button" className="btn btn-danger" onClick={handleCancel}>
                                                                        Cancel
                                                                    </button>
                                                                    <button type="submit" className="btn btn-outline-primary"  >
                                                                        {isEditing ? "Update Address" : "Add Address"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                ) : (
                                                    <form>
                                                        {addresses.map((addr) => (
                                                            <div
                                                                key={addr.addressId}
                                                                className="border p-3 rounded mb-4 position-relative"
                                                                style={{
                                                                    backgroundColor: selectedAddressId === addr.addressId ? "#f0f8ff" : "white",
                                                                }}
                                                            >
                                                                <div style={{ position: "absolute", top: "12px", right: "10px", display: "flex", gap: "8px" }}>
                                                                    <i
                                                                        className="pi pi-pencil"
                                                                        style={{ cursor: "pointer" }}
                                                                        title="Edit"
                                                                        onClick={() => openUpdateAddress(addr.addressId)}
                                                                    ></i>
                                                                </div>

                                                                <div className="d-flex" style={{ alignItems: "start" }}>
                                                                    <input
                                                                        type="radio"
                                                                        name="selectedAddress"
                                                                        id="selectedAddress"
                                                                        checked={selectedAddressId === addr.addressId}
                                                                        onChange={() => setSelectedAddressId(addr.addressId)}
                                                                    />
                                                                    <label htmlFor="selectedAddress"></label>
                                                                    <div>
                                                                        <strong>{addr.firstName} {addr.lastName}</strong>
                                                                        <span className="badge bg-secondary ms-2">{addr.addressType}</span>
                                                                        <div>{addr.addressLine1}, {addr.addressLine2}</div>
                                                                        <div>{addr.city}, {addr.state}, {addr.country} - {addr.pincode}</div>
                                                                        <div>Phone: {addr.phone}</div>
                                                                        {addr.alterPhone && <div>Alternate Phone: {addr.alterPhone}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </form>
                                                )}

                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {
                        items.length >= 1 && (
                            <div className="mn-checkout-rightside col-lg-4 col-md-12 m-t-991">
                                <div className="mn-sidebar-wrap">
                                    <div className="mn-sidebar-block">
                                        <div className="mn-sb-title">
                                            <h3 className="mn-sidebar-title">Summary</h3>
                                        </div>
                                        <div className="mn-sb-block-content">

                                            <div className="mn-checkout-summary">
                                                <div>
                                                    <span className="text-left">Sub-Total</span>
                                                    <span className="text-right">{subTotal.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-left">GST (18%)</span>
                                                    <span className="text-right">{gst.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-left">Shipping Charges</span>
                                                    <span className="text-right">{shippingCharges.toFixed(2)}</span>
                                                </div>
                                                <div className="mn-checkout-summary-total">
                                                    <span className="text-left">Total Amount</span>
                                                    <span className="text-right">{totalAmount.toFixed(2)}</span>
                                                </div>


                                                <div className="mn-checkout-coupan-content">
                                                    <form className="mn-checkout-coupan-form" name="mn-checkout-coupan-form"
                                                        method="post" action="#">
                                                        <input className="mn-coupan" type="text" required=""
                                                            placeholder="Enter Your Coupan Code" name="mn-coupan" />
                                                        <button className="mn-coupan-btn mn-btn-2" type="submit" name="subscribe"
                                                            value=""><span>Apply</span></button>
                                                    </form>
                                                </div>
                                                {/* <div className="mn-checkout-summary-total">
                                                <span className="text-left">Total Amount</span>
                                                <span className="text-right">$375.00</span>
                                            </div> */}
                                            </div>
                                            <div className="mn-checkout-pro">

                                                <div className="col-sm-12 mb-6">
                                                    {cartList.map((item) => (
                                                        <div className="mn-product-inner" key={item.cartItemId}>
                                                            <div className="mn-pro-image-outer">
                                                                <div className="mn-pro-image">
                                                                    <a onClick={
                                                                        () => navigate(`/product-details/${item.product.productId}`)
                                                                    }
                                                                        className="image">
                                                                        <img
                                                                            className="main-image"
                                                                            src={serverPort + item.product.productUrl}
                                                                            alt={item.product.productName}
                                                                            onClick={
                                                                                () => navigate(`/product-details/${item.product.productId}`)
                                                                            }
                                                                        />
                                                                        <img
                                                                            className="hover-image main-image"
                                                                            src={serverPort + item.product.productUrl}
                                                                            alt={item.product.productName}
                                                                            onClick={
                                                                                () => navigate(`/product-details/${item.product.productId}`)
                                                                            }
                                                                        />
                                                                    </a>
                                                                </div>
                                                            </div>

                                                            <div className="mn-pro-content">
                                                                <h5 className="mn-pro-title">
                                                                    <a onClick={() => navigate(`/product-details/${item.product.productId}`)}>{item.product.productName}</a>
                                                                </h5>
                                                                {/* rating */}
                                                                {/* <div className="mn-pro-rating">
                                                                <i className="ri-star-fill"></i>
                                                                <i className="ri-star-fill"></i>
                                                                <i className="ri-star-fill"></i>
                                                                <i className="ri-star-fill"></i>
                                                                <i className="ri-star-fill grey"></i>
                                                            </div> */}

                                                                <span className="mn-price">
                                                                    <span className="old-price"> {item.cartAddedOption[0]?.optionDiscountPrice} </span>
                                                                    <span className="new-price">
                                                                        {item?.cartAddedOption?.[0]?.optionPrice
                                                                            ? `₹${item.cartAddedOption[0].optionPrice}`
                                                                            : "N/A"}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="d-flex flex-row justify-content-end">
                                <span className="mn-check-order-btn">
                                    <a className="mn-btn-2"><span>Place Order</span></a>
                                </span>
                            </div> */}


                                {/* <div className="mn-sidebar-wrap mn-checkout-del-wrap">
                                
                                <div className="mn-sidebar-block">
                                    <div className="mn-sb-title">
                                        <h3 className="mn-sidebar-title">Delivery Method</h3>
                                    </div>
                                    <div className="mn-sb-block-content">
                                        <div className="mn-checkout-del">
                                            <div className="mn-del-desc">Please select the preferred shipping method to use
                                                on this
                                                order.</div>
                                            <form action="#">
                                                <span className="mn-del-option">
                                                    <span>
                                                        <span className="mn-del-opt-head">Free Shipping</span>
                                                        <input type="radio" id="del1" name="radio-group" defaultChecked />
                                                        <label htmlFor="del1">Rate - $0 .00</label>
                                                    </span>
                                                    <span>
                                                        <span className="mn-del-opt-head">Flat Rate</span>
                                                        <input type="radio" id="del2" name="radio-group" />
                                                        <label htmlFor="del2">Rate - $5.00</label>
                                                    </span>
                                                </span>
                                            </form>
                                        </div>
                                    </div>
                                </div>
    
                            </div> */}


                                <div className="mn-sidebar-wrap mn-checkout-del-wrap">

                                    <div className="mn-sidebar-block">
                                        <div className="mn-sb-title">
                                            <h3 className="mn-sidebar-title">Payment Method</h3>
                                        </div>
                                        <div className="mn-sb-block-content">
                                            <div className="mn-checkout-pay">
                                                <div className="mn-pay-desc">Please select the preferred payment method to use
                                                    on this
                                                    order.</div>
                                                <form action="#">
                                                    <span className="mn-pay-option m-b-15">
                                                        <span>
                                                            <input type="radio" id="pay1" name="radio-group" defaultChecked />
                                                            <label htmlFor="pay1">Online Payment</label>
                                                        </span>
                                                    </span>
                                                    {/* <span className="mn-pay-commemt">
                                                    <span className="mn-pay-opt-head">Add extra note</span>
                                                    <textarea name="your-commemt" placeholder="Comments"></textarea>
                                                </span> */}
                                                    <span className="mn-pay-agree">
                                                        <input type="checkbox" value="" onChange={
                                                            () => setTermsChecked(true)
                                                        } />
                                                        I have agree with <a >Terms & Conditions.</a>
                                                        <span className="checked"></span>
                                                    </span>
                                                </form>
                                                <hr />
                                                <button type="button" onClick={addNewPayment} className="btn btn-primary w-100" disabled={termsChecked ? false : true} >Pay Now </button>

                                            </div>
                                        </div>
                                    </div>



                                    {/* <div className="mn-sidebar-wrap mn-checkout-del-wrap">
                                    <div className="mn-sidebar-block">
                                        <div className="mn-sb-title">
                                            <h3 className="mn-sidebar-title">Payment Method</h3>
                                        </div>
                                        <div className="mn-sb-block-content">
                                            <div className="mn-check-pay-img-inner">
                                                <div className="mn-check-pay-img">
                                                    <img src="assets/img/footer/payment.png" alt="payment" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                </div>

                            </div>
                        )
                    }

                </div>
            </section>
        </div>

    )

}

export default Checkout;
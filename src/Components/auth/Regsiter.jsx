import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";


const Register = () => {

    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        setProcessing(true);
        e.preventDefault();

        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            try {
                const response = await fetch("http://localhost:8081/api/user/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                });

                const data = await response.json();
                if (response.ok) {
                    setProcessing(false);
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 2500);
                    setForm({ username: "", email: "", password: "" });

                    toast.success("Signup successful!", {
                        autoClose: 100,
                        onClose: () => {
                            navigate("/login");
                        },
                    });
                } else {
                    toast.error("Signup failed.");
                }
            } catch (error) {
                toast.error("Server error. Please try again later.");
            }
        }
    };

    return (

        // <!-- Main Content -->
        <div className="mn-main-content">
            <div className="mn-breadcrumb m-b-30">
                <div className="row">
                    <div className="col-12">
                        <div className="row gi_breadcrumb_inner">
                            <div className="col-md-6 col-sm-12">
                                <h2 className="mn-breadcrumb-title">Register Page</h2>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {/* <!-- mn-breadcrumb-list start --> */}
                                <ul className="mn-breadcrumb-list">
                                    <li className="mn-breadcrumb-item"><a href="index.html">Home</a></li>
                                    <li className="mn-breadcrumb-item active">Register Page</li>
                                </ul>
                                {/* <!-- mn-breadcrumb-list end --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Register section --> */}
            <section className="mn-register p-b-15">
                <div className="mn-title d-none">
                    <h2>Register<span></span></h2>
                    <p>Best place to buy and sell digital products.</p>
                </div>
                <div className="row">
                    <div className="mn-register-wrapper">
                        <div className="mn-register-container">
                            <div className="mn-register-form">
                                <form action="#" method="post">
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>First Name*</label>
                                        <input className="text-dark" type="text" name="firstname" placeholder="Enter your first name"
                                            required />
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>Last Name*</label>
                                        <input className="text-dark" type="text" name="lastname" placeholder="Enter your last name" required />
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>Email*</label>
                                        <input className="text-dark" type="email" name="email" placeholder="Enter your email add..." required />
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>Phone Number*</label>
                                        <input className="text-dark" type="text" name="phonenumber" placeholder="Enter your phone number"
                                            required />
                                    </span>
                                    <span className="mn-register-wrap">
                                        <label>Address</label>
                                        <input className="text-dark" type="text" name="address" placeholder="Address Line 1" />
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>City *</label>
                                        <span className="mn-rg-select-inner">
                                            <select name="gi_select_city" id="mn-select-city"
                                                className="mn-register-select">
                                                <option selected disabled>City</option>
                                                <option value="1">City 1</option>
                                                <option value="2">City 2</option>
                                                <option value="3">City 3</option>
                                                <option value="4">City 4</option>
                                                <option value="5">City 5</option>
                                            </select>
                                        </span>
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>Post Code</label>
                                        <input className="text-dark" type="text" name="postalcode" placeholder="Post Code" />
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>Country *</label>
                                        <span className="mn-rg-select-inner">
                                            <select name="gi_select_country" id="mn-select-country"
                                                className="mn-register-select">
                                                <option selected disabled>Country</option>
                                                <option value="1">Country 1</option>
                                                <option value="2">Country 2</option>
                                                <option value="3">Country 3</option>
                                                <option value="4">Country 4</option>
                                                <option value="5">Country 5</option>
                                            </select>
                                        </span>
                                    </span>
                                    <span className="mn-register-wrap mn-register-half">
                                        <label>Region State</label>
                                        <span className="mn-rg-select-inner">
                                            <select name="gi_select_state" id="mn-select-state"
                                                className="mn-register-select">
                                                <option selected disabled>Region/State</option>
                                                <option value="1">Region/State 1</option>
                                                <option value="2">Region/State 2</option>
                                                <option value="3">Region/State 3</option>
                                                <option value="4">Region/State 4</option>
                                                <option value="5">Region/State 5</option>
                                            </select>
                                        </span>
                                    </span>
                                    <span className="mn-register-wrap mn-recaptcha">
                                        <span className="g-recaptcha"
                                            data-sitekey="6LfKURIUAAAAAO50vlwWZkyK_G2ywqE52NU7YO0S"
                                            data-callback="verifyRecaptchaCallback"
                                            data-expired-callback="expiredRecaptchaCallback"></span>
                                        <input className="form-control d-none" data-recaptcha="true" required
                                            data-error="Please complete the Captcha" />
                                        <span className="help-block with-errors"></span>
                                    </span>
                                    <span className="mn-register-wrap mn-register-btn">
                                        <span>Have an account?
                                            <Link to='/login'>
                                                Login</Link>
                                        </span>
                                        <button className="mn-btn-1" type="submit"><span>Register</span></button>
                                    </span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>


    )

}


export default Register;
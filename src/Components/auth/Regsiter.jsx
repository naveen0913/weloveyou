import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { prodUrl, validateEmail, validatePassword, validateUsername } from "../Constants";
import { ProgressSpinner } from "primereact/progressspinner";


const Register = () => {

    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [processing, setProcessing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        let error = "";
        if (name === "username") {
            error = validateUsername(value);
        } else if (name === "email") {
            error = validateEmail(value);
        } else if (name === "password") {
            error = validatePassword(value);
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const usernameError = validateUsername(form.username);
        const emailError = validateEmail(form.email);
        const passwordError = validatePassword(form.password);

        const newErrors = {
            username: usernameError,
            email: emailError,
            password: passwordError,
        };
        setErrors(newErrors);

        if (usernameError || emailError || passwordError) {
            setProcessing(false);
            return;
        }

        try {
            const response = await fetch(prodUrl + "user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Signup successful!", {
                    autoClose: 100,
                    onClose: () => navigate("/login"),
                });
                setForm({ username: "", email: "", password: "" });
                setSubmitted(true);
            } else {
                toast.error(data.message || "Signup failed.");
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
            console.error("Signup error:", error);
        } finally {
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
            {/* <!-- Main Content  */}
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

                <section className="mn-login p-b-15">
                    <div className="mn-title d-none">
                        <h2>Login<span></span></h2>
                        <p>Get access to your Orders, Wishlist and Recommendations.</p>
                    </div>
                    <div className="mn-login-content">
                        <div className="mn-login-box">
                            <div className="mn-login-wrapper">
                                <div className="mn-login-container">
                                    <div className="mn-login-form">
                                        <form onSubmit={handleSubmit}>
                                            {/* Username */}
                                            <span className="mn-login-wrap">
                                                <label htmlFor="username">Username*</label>
                                                <input
                                                    id="username"
                                                    className="text-dark"
                                                    value={form.username}
                                                    type="text"
                                                    name="username"
                                                    placeholder="Enter your username"
                                                    onChange={handleChange}
                                                    required />
                                                {errors.username && <small className="text-danger m-top">{errors.username}</small>}
                                            </span>

                                            {/* Email */}
                                            <span className="mn-login-wrap">
                                                <label htmlFor="email">Email Address*</label>
                                                <input
                                                    id="email"
                                                    className="text-dark"
                                                    value={form.email}
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter your email address"
                                                    onChange={handleChange}
                                                    required />
                                                {errors.email && <small className="text-danger m-btm">{errors.email}</small>}
                                            </span>

                                            {/* Password */}
                                            <span className="mn-login-wrap">
                                                <label>Password*</label>
                                                <input
                                                    className="text-dark"
                                                    value={form.password}
                                                    type="password"
                                                    name="password"
                                                    placeholder="Enter your password"
                                                    onChange={handleChange}
                                                    required />
                                                {errors.password && <small className="text-danger m-btm">{errors.password}</small>}
                                            </span>

                                            {/* Submit */}
                                            <span className="mn-login-wrap mn-login-btn no-spacing">
                                                <span>
                                                    Have an account?
                                                    <Link to="/login"> Login</Link>
                                                </span>
                                                <button
                                                    className="mn-btn-1 btn"
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    {processing ? "Registering..." : "Register"}
                                                </button>
                                            </span>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mn-login-box d-n-991">
                            <div className="mn-login-img">
                                <img src="assets/img/common/about-3.png" alt="login" />
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer />
            </div></>

    )

}


export default Register;
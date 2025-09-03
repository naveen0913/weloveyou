
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { validateEmail } from "../Constants";
import { ProgressSpinner } from "primereact/progressspinner";


function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const [emailError, setEmailError] = useState("");
    const [processing,setProcessing] = useState(false);


    useEffect(() => {
        let interval;
        if (disabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setDisabled(false);
        }
        return () => clearInterval(interval);
    }, [disabled, timer]);

    const sendEmailOTP = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const res = await axios.post(
                "http://localhost:8081/api/user/forgot-password",
                {
                    email: email,
                },
            );
            setProcessing(false);
            if (res.data.code === 200) {
                toast.success("Otp sent to mail!")
                setDisabled(true);
                setTimer(60);
            }

        } catch (error) {
            setProcessing(false);
            if (error.response && error.status === 404) {
                toast.error("Email not found. Please check and try again.");
            } else {
                toast.error(
                    error?.response?.data?.message || "Failed to send OTP. Try again.",
                );
            }
        }
    };


    const [errors, setErrors] = useState({
        email: "",
        otp: "",
        passwordMatch: "",
    });

    const onEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        const errorMsg = validateEmail(value);
        setEmailError(errorMsg);
    };


    const isFormValid = () => {
        return (
            otp.length === 6 &&
            !otp.includes(" ") &&
            password.trim().length > 0 &&
            confirmPassword.trim().length > 0 &&
            password === confirmPassword
        );
    };

    const validateForm = () => {
        let formErrors = { otp: "", passwordMatch: "" };

        if (otp.length < 6 || otp.includes(" ")) {
            formErrors.otp = "Please enter all 6 digits of OTP.";
        }

        if (password !== confirmPassword) {
            formErrors.passwordMatch = "Passwords do not match.";
        }

        setErrors(formErrors);

        return !formErrors.otp && !formErrors.passwordMatch;
    };

    const resetPassword = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const paylaod = {
            email: email,
            otp,
            newPassword: password,
            confirmPassword: confirmPassword,
        }
        setProcessing(true);
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8081/api/user/reset-password", paylaod);
            console.log("res", res);
            if (res.data.code === 200) {
                setProcessing(false);
                navigate("/login");
                toast.success("Password Update Successful!");
                setProcessing(false);
            }else{
                toast.error(
                    "Failed to reset password. Check OTP.",
                );
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to reset password. Check OTP.",
            );
            setProcessing(false);
        }
    };

    return (

        <><div>
            {processing && (
                <div className="overlay-screen">
                    <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="3" />
                </div>
            )}
        </div>
        <div className="backg">
                <div className="container-fluid d-flex align-items-center justify-content-center mt-3 mb-3">
                    <ToastContainer />
                    <div
                        className="card shadow p-4"
                        style={{ maxWidth: 450, width: "100%" }}>
                        <h4 className="text-center">
                            Forgot Password
                        </h4>
                        <hr className="no-spacing" />

                        <form>
                            <div className="mt-3 d-flex flex-column">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control email-field"
                                    placeholder="Enter your email here"
                                    required
                                    onChange={onEmailChange}
                                    value={email} />
                            </div>
                            <div>
                                {emailError && <small className="text-danger">{emailError}</small>}

                            </div>

                            <button
                                type="submit"
                                className="text-light mt-1 mb-3 send-otp-btn"
                                disabled={disabled}
                                onClick={sendEmailOTP}
                            >
                                {disabled ? `Resend OTP in ${timer}s` : "Send OTP"}
                            </button>

                            {/* resst code */}
                            <div className="mb-3">
                                <label className="form-label d-block">OTP</label>
                                <div
                                    className="d-flex"
                                    style={{ gap: "0.8rem", marginTop: "8px" }}>
                                    {Array.from({ length: 6 }).map((_, idx) => (
                                        <input
                                            key={idx}
                                            type="number"
                                            maxLength="1"
                                            className="text-center otp-input"
                                            value={otp[idx] || ""}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/, "");
                                                if (!value) return;
                                                const otpArray = otp.split("");
                                                otpArray[idx] = value;
                                                const newOtp = otpArray.join("").padEnd(6, "");
                                                setOtp(newOtp);

                                                // Focus next input
                                                const next = document.getElementById(`otp-${idx + 1}`);
                                                if (next) next.focus();
                                            } }
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace") {
                                                    const otpArray = otp.split("");
                                                    otpArray[idx] = "";
                                                    setOtp(otpArray.join("").padEnd(6, ""));
                                                    if (idx > 0 && !otp[idx]) {
                                                        const prev = document.getElementById(
                                                            `otp-${idx - 1}`
                                                        );
                                                        if (prev) prev.focus();
                                                    }
                                                }
                                            } }
                                            id={`otp-${idx}`} />
                                    ))}
                                </div>
                                {errors.otp && <small className="text-danger">{errors.otp}</small>}
                            </div>

                            {/* New Password */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="form-control password-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="enter new password" />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? (
                                            <i className="pi pi-eye-slash"></i>
                                        ) : (
                                            <i className="pi pi-eye"></i>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-2">
                                <label className="form-label">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control password-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="enter confirm password" />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? (
                                            <i className="pi pi-eye-slash"></i>
                                        ) : (
                                            <i className="pi pi-eye"></i>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-center">
                                <button className="reset-btn" disabled={!isFormValid()} onClick={resetPassword}> Reset Password </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div></>
    );
}

export default ForgotPassword;
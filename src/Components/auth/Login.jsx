import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure, setUser } from "../../Store/Slices/authSlice";
import { validateEmail } from "../Constants";


const Login = () => {

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        let error = "";
        if (name === "email") {
            error = validateEmail(value);
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };


    const handleSubmit = async (e) => {
        setProcessing(true);
        e.preventDefault();
        const emailError = validateEmail(form.email);
        setErrors({
            email: emailError,
        });

        if (emailError) {
            return;
        }
        dispatch(loginStart());
        try {
            const response = await fetch("http://localhost:8081/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });
            const data = await response.json();

            if (data.code !== 200) {
                dispatch(loginFailure(data.message));
                toast.error(data.message || "Login failed");
                setProcessing(false);
                return;
            }
            dispatch(
                loginSuccess({
                    user: data.data.user,
                    role: data.data.user.role,
                    userId: data.data.user.id,
                })
            );
            dispatch(setUser({ userId: data.data.id }));
            toast.success("Login successful!", { autoClose: 500 });
            setForm({ email: "", password: "" });
            setProcessing(false);

            if (data.data.user.role === "admin") {
                navigate("/admindashboard");
            } else {
                window.location.href='/';
                // navigate("/", { replace: true, state: { showAccountPrompt: true } });
            }
        } catch (err) {
            console.error("Login error:", err);
            dispatch(loginFailure("Something went wrong"));
            toast.error("Something went wrong");
            setProcessing(false);
        }
    };



    return (

        <div className="mn-main-content">
            <div className="mn-breadcrumb m-b-30">
                <div className="row">
                    <div className="col-12">
                        <div className="row gi_breadcrumb_inner">
                            <div className="col-md-6 col-sm-12">
                                <h2 className="mn-breadcrumb-title">Login Page</h2>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {/* <!-- mn-breadcrumb-list start --> */}
                                <ul className="mn-breadcrumb-list">
                                    <li className="mn-breadcrumb-item"><a href="index.html">Home</a></li>
                                    <li className="mn-breadcrumb-item active">Login Page</li>
                                </ul>
                                {/* <!-- mn-breadcrumb-list end --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* // <!-- Login section --> */}
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
                                    <form>
                                        <span className="mn-login-wrap">
                                            <label htmlFor="email">Email Address*</label>
                                            <input id="email" className="text-dark" value={form.email} required
                                                type="email" name="email" placeholder="Enter your email address"
                                                onChange={handleChange}
                                            />
                                            {errors.email && <small className="text-danger m-top">{errors.email}</small>}

                                        </span>
                                        <span className="mn-login-wrap">
                                            <label>Password*</label>
                                            <input className="text-dark" value={form.password}
                                                type="password" name="password" placeholder="Enter your password"
                                                onChange={handleChange}
                                                required />

                                        </span>
                                        <span className="mn-login-wrap mn-login-fp no-spacing">
                                            {/* <span className="mn-remember">
                                                <input type="checkbox" value="" />
                                                Remember
                                                <span className="checked"></span>
                                            </span> */}
                                            <label>
                                                {/* <a href="#"></a> */}
                                                <Link to="/forgot-password" >
                                                    Forgot Password?
                                                </Link>
                                            </label>
                                        </span>
                                        <span className="mn-login-wrap mn-login-btn mt-4">
                                            <span>
                                                <Link to="/register" >
                                                    Create Account?
                                                </Link>

                                            </span>
                                            <button className="mn-btn-1 btn" onClick={handleSubmit} type="submit"><span>Login</span></button>
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
        </div>



    )
}

export default Login;
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Contact = () => {

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            contactName: form.name,
            email: form.email,
            contactMessage: form.message,
        };

        try {
            const response = await fetch(
                prodUrl + "contact/message",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );

            if (response.status === 201) {
                setSuccess("Your message has been sent successfully!");
                setForm({ name: "", email: "", message: "" });
                setError("");
                setFormErrors({});
            } else {
                setError("Failed to send your message. Please try again.");
            }
        } catch (err) {
            console.error("Contact form submission error:", err);
            setError("An error occurred while sending your message.");
        }
    };

    return (
        <>
            <div className="mn-main-content">
                <div className="mn-breadcrumb m-b-30 mt-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="row gi_breadcrumb_inner">
                                <div className="col-md-6 col-sm-12">
                                    <h2 className="mn-breadcrumb-title">Contact us Page</h2>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    {/* <!-- mn-breadcrumb-list start --> */}
                                    <ul className="mn-breadcrumb-list">
                                        <li className="mn-breadcrumb-item">
                                            <NavLink to="/">Home</NavLink>
                                        </li>
                                        <li className="mn-breadcrumb-item active">Contact us Page</li>
                                    </ul>
                                    {/* <!-- mn-breadcrumb-list end --> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Contact us section --> */}
                <section className="mn-contact p-b-15">
                    <div className="mn-title d-none">
                        <h2>
                            Get in <span>Touch</span>
                        </h2>
                        <p>
                            Please select a topic below related to you inquiry. If you don't
                            fint what you need, fill out our contact form.
                        </p>
                    </div>

                    <div className="content-container">
                        <div className="first-content">
                            Have ❤️love-filled questions? Want to know more about our ❤️love-driven, ❤️love-inspired, and ❤️love-wrapped world? We’d love❤️, love❤️, and absolutely love❤️ to hear from you! Your thoughts, feedback, and messages are always lovable, ❤️love-worthy, and loved by us. So don’t hesitate, reach out with love❤️, for love❤️, and in the name of love❤️!
                        </div>
                        <div className="sec-content">
                            Because at We Love❤️ You, every connection is built on love❤️, love❤️, and more love❤️!
                        </div>
                        <div className="third-content">
                            "We’d Love❤️ to Hear from You!"
                        </div>
                    </div>

                    <div className="row p-t-80">
                        <div className="col-md-6 mn-contact-detail m-b-m-30">
                            <div className="first-block-container">
                                <div className="mn-box mb-2">
                                    <div className="detail">
                                        <div className="icon">
                                            <i className="pi pi-envelope"></i>
                                        </div>
                                        <div className="info">
                                            <h3 className="title">Contact Mail</h3>
                                            <a href="mailto:info@weloveyou.in">
                                                <p>info@weloveyou.in</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mn-box mb-2">
                                    <div className="detail">
                                        <div className="icon">
                                            <i className="pi pi-phone"></i>
                                        </div>
                                        <div className="info">
                                            <h3 className="title">Contact Phone</h3>
                                            <a href="tel:+917013220781">
                                                <p>+91 7013220781</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="mn-box m-b-30">
                                <div className="detail">
                                    <div className="icon">
                                        <i className="ri-map-pin-line"></i>
                                    </div>
                                    <div className="info">
                                        <h3 className="title">Address</h3>
                                        <p>Hyderabad, Telangana, India.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 m-t-767">
                            <form onSubmit={handleSubmit}>

                                <div className="form-group">
                                    <label htmlFor="name"></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Full Name"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email"></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        placeholder="Phone"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message"></label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows="2"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Message"></textarea>
                                </div>
                                <button type="submit" className="mn-btn-2">
                                    <span>Submit</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )

}

export default Contact;
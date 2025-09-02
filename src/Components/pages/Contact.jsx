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
        "http://localhost:8081/api/contact/message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.status===201) {
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
                <div className="mn-breadcrumb m-b-30">
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
                    <div className="row p-t-80">
                        <div className="col-md-6 mn-contact-detail m-b-m-30">
                            <div className="mn-box m-b-30">
                                <div className="detail">
                                    <div className="icon">
                                        <i className="ri-mail-send-line"></i>
                                    </div>
                                    <div className="info">
                                        <h3 className="title">Contact Mail</h3>
                                        <p>info@weloveyou.in</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mn-box m-b-30">
                                <div className="detail">
                                    <div className="icon">
                                        <i className="ri-customer-service-2-line"></i>
                                    </div>
                                    <div className="info">
                                        <h3 className="title">Contact Phone</h3>
                                        <p>+91 7013220781</p>
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
                                        rows="5"
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
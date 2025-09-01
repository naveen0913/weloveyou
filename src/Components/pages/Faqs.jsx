import { useState } from "react";
import { Link } from "react-router-dom";

const Faqs = () => {
	// track open index for left and right columns
	const [openLeft, setOpenLeft] = useState(0); // first item open by default
	const [openRight, setOpenRight] = useState(0);

	// Example FAQ data (split into left & right for clarity)
	const faqsLeft = [
		{
			q: "What is the multi vendor services?",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
		},
		{
			q: "How to buy many products at a time?",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
		{
			q: "Refund policy for customer.",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
		{
			q: "Exchange policy for customer.",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
		{
			q: "Give a way products available.",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
	];

	const faqsRight = [
		{
			q: "Refund policy for customer.",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
		{
			q: "Exchange policy for customer.",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
		},
		{
			q: "How to buy many products at a time?",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
		},
		{
			q: "Give a way products available.",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
		{
			q: "What is the multi vendor services?",
			a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		},
	];

	return (
		<div className="mn-main-content">
			{/* Breadcrumb */}
			<div className="mn-breadcrumb m-b-30">
				<div className="row">
					<div className="col-12">
						<div className="row gi_breadcrumb_inner">
							<div className="col-md-6 col-sm-12">
								<h2 className="mn-breadcrumb-title">FAQ Page</h2>
							</div>
							<div className="col-md-6 col-sm-12">
								<ul className="mn-breadcrumb-list">
									<li className="mn-breadcrumb-item">
										<Link to="/">Home</Link>
									</li>
									<li className="mn-breadcrumb-item active">FAQ Page</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<section className="mn-faq p-b-15">
				<div className="row">
					{/* Left Column */}
					<div className="col-lg-6">
						<div className="mn-accordion style-1">
							{faqsLeft.map((faq, i) => (
								<div key={i} className="mn-accordion-item">
									<h4
										className="mn-accordion-header"
										onClick={() => setOpenLeft(i === openLeft ? null : i)}
										style={{ cursor: "pointer" }}
									>
										{faq.q}
									</h4>
									<div
										className={`mn-accordion-body ${openLeft === i ? "show" : ""
											}`}
									>
										{faq.a}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Right Column */}
					<div className="col-lg-6 m-t-991">
						<div className="mn-accordion style-1">
							{faqsRight.map((faq, i) => (
								<div key={i} className="mn-accordion-item">
									<h4
										className="mn-accordion-header"
										onClick={() => setOpenRight(i === openRight ? null : i)}
										style={{ cursor: "pointer" }}
									>
										{faq.q}
									</h4>
									<div
										className={`mn-accordion-body ${openRight === i ? "show" : ""
											}`}
									>
										{faq.a}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Faqs;

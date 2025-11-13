import { useState } from "react";
import { Link } from "react-router-dom";

const Faqs = () => {
	// track open index for left and right columns
	const [openLeft, setOpenLeft] = useState(0); // first item open by default
	const [openRight, setOpenRight] = useState(0);

	// Example FAQ data (split into left & right for clarity)
	const faqsLeft = [
		{
			q: "What is the Customized Times Table Book, and how does it spread love?",
			a: "Our Customized Times Table Book is a love-filled learning companion where you can upload 24 lovable pictures of your child to create a unique, love-crafted book covering 20 multiplication tables. Every page radiates love, making learning math fun, personal, and filled with love.",
		},
		{
			q: "How do I upload photos for the Customized Times Table Book?",
			a: "With love and ease! You simply upload 24 lovable photos of your child through our love-driven upload form while placing your order. Our team lovingly ensures every photo is wrapped with love and placed perfectly in the book.",

		},
		{
			q: "Can I preview the Customized Times Table Book before it is printed with love?",
			a: "Yes! We’ll lovingly share a love-filled preview so you can feel the joy before your child holds their love-crafted math book. After your approval, we lovingly print and deliver it.",

		},
		{
			q: "What makes the Book Labels so special and filled with love?",
			a: "Our Book Labels are not just labels, they’re love-wrapped identity cards for your child’s school books. You upload one lovable photo and fill in the details like Name, Section, Subject, Roll Number, and School Name, and we lovingly craft labels that shine with love every day.",

		},
		{
			q: "How many Book Labels do I get in one love-filled set?",
			a: "Every order comes with a lovingly curated sheet of 30 book labels, plus one lovable bag sticker, one love-filled bottle sticker, one snack box sticker, one box sticker, and an extra name sticker to use anywhere you like,  ensuring your child’s school essentials stay beautifully organized with love, love, and more love.",

		},
	];

	const faqsRight = [
		{
			q: "What is the personalized pencil engraving, and why is it a gift of love?",
			a: "We lovingly engrave your child’s name on pencils, turning everyday writing into a love-filled experience. Each pencil becomes a lovable treasure that inspires children to write, learn, and grow with love.",

		},
		{
			q: "Are the products safe, child-friendly, and wrapped in love?",
			a: "Absolutely! Every product we create is designed with love-filled safety, love-driven quality, and love-inspired care, making sure your child experiences nothing but pure love.",
		},
		{
			q: "Can I gift these love-filled products to other children?",
			a: "Yes! Our products make the most lovable, love-driven gifts for birthdays, school achievements, and special occasions. Each gift spreads happiness and shines with love.",
		},
		{
			q: "How long does it take to receive my love-crafted order?",
			a: "Each product is made with patience, care, and love. Usually, it takes 7–10 love-filled working days for your personalized order to be lovingly delivered to your doorstep."
		},
		{
			q: "Why choose “We Love You” for my child’s products?",
			a: "Because at We Love You, every product is more than an item,  it’s a love-wrapped memory, a love-driven keepsake, and a lovable way to make your child feel special every single day. We believe nothing matters more than love, love, and more love!",

		},
	];

	return (
		<div className="mn-main-content">
			{/* Breadcrumb */}
			<div className="mn-breadcrumb m-b-30 mt-4">
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
										<span className="faq-a">
											{faq.a}
										</span>
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
										<span className="faq-a">
											{faq.a}
										</span>
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

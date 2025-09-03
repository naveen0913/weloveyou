
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BreadCrumb } from "primereact/breadcrumb";
import { TrackingStatus, TrackingSteps } from "../../Constants";

const ViewTracking = ({ data, onBack }) => {
	const [order, setOrder] = useState({});
	const invoiceRef = useRef();
	const [previewImages, setPreviewImages] = useState([]);

	const fetchOrderDetails = async () => {
		try {
			const res = await axios.get(`http://localhost:8081/api/order/${data}`);
			if (res.data.code === 200) {
				setOrder(res.data.data);
				console.log("order", res.data.data);
			} else {
				setOrder({});
			}
		} catch (err) {
			console.error("Error fetching order:", err);
		}
	};

	useEffect(() => {
		fetchOrderDetails();
	}, [data]);

	const items = [
		{
			label: "Orders",
			command: () => onBack()
		},
		{
			label: data
		}
	];

	const handleViewAll = (images) => {
		setModalImages(images);
		setShowImageModal(true);
	};

	const showTrackingStatus = () => {
		switch (order?.orderTracking?.trackingStatus) {
			case TrackingStatus.placed:
				return "Order Confirmed";
			case TrackingStatus.packed:
				return "Processing Order";
			case TrackingStatus.shipped:
				return "Quality check";
			case TrackingStatus.out_for_delivery:
				return "Product dispatched";
			case TrackingStatus.delivered:
				return "Product Delivered";
			default:
				return "Order Confirmed";
		}

	}

	const stepIndexMap = {
		[TrackingStatus.placed]: 1,
		[TrackingStatus.packed]: 2,
		[TrackingStatus.shipped]: 3,
		[TrackingStatus.out_for_delivery]: 4,
		[TrackingStatus.delivered]: 5
	};

	// get current step
	const currentStep = stepIndexMap[order?.orderTracking?.trackingStatus] || 1;


	return (
		<>

			{/* // <!-- Main Content --> */}
			<div className="mn-main-content">
				<div className="mn-breadcrumb m-b-30">
					<div className="row">
						<div className="col-12">
							<div className="row gi_breadcrumb_inner">
								<div className="col-md-6 col-sm-12">
									<h2 className="mn-breadcrumb-title">Track Order</h2>
								</div>
								<div className="col-md-6 col-sm-12">
									{/* <!-- mn-breadcrumb-list start --> */}
									<ul className="mn-breadcrumb-list">
										<li className="mn-breadcrumb-item"><a onClick={onBack} >Orders</a></li>
										<li className="mn-breadcrumb-item active">{order?.orderId}</li>
									</ul>
									{/* <!-- mn-breadcrumb-list end --> */}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <!-- Track Order section --> */}
				<section className="mn-track p-b-15">
					<div className="mn-title d-none">
						<h2>Track<span> Order</span></h2>
						<p>We delivering happiness and needs, Faster than you can think.</p>
					</div>
					<div className="row">
						<div className="container">
							<div className="mn-track-box">
								{/* <!-- Details--> */}
								<div className="row m-b-m-30">
									<div className="col-lg-3 col-sm-6 col-12 m-b-30">
										<div className="mn-track-card"><span
											className="mn-track-title">order</span><span>#{order?.orderId}</span>
										</div>
									</div>
									<div className="col-lg-3 col-sm-6 col-12 m-b-30">
										<div className="mn-track-card">
											{order?.orderItems?.map((item) => {
												return (
													<React.Fragment key={item.id}>
														<span className="mn-track-title">
															{item?.product?.productName}
														</span>
														<span>{item?.product?.pCategory}</span>
													</React.Fragment>
												);
											})}
										</div>

									</div>
									<div className="col-lg-3 col-sm-6 col-12 m-b-30">
										<div className="mn-track-card"><span className="mn-track-title">Expected
											date</span>
											<span>
												{order?.orderTracking?.estimatedDelivery}
											</span>
										</div>
									</div>
									<div className="col-lg-3 col-sm-6 col-12 m-b-30">
										<div className="mn-track-card"><span className="mn-track-title">Progress</span><span>
											{showTrackingStatus()}
										</span></div>
									</div>
								</div>
								{/* <!-- Progress--> */}
								{/* <div className="mn-steps">
									<div className="mn-steps-body">
										<div className={`mn-step ${order?.orderTracking?.trackingStatus===TrackingStatus.placed} mn-step-completed`}>
											<span className="mn-step-indicator">
												<i className="ri-check-line"></i>
											</span>
											<span className="mn-step-icon">
												<i className="ri-shield-check-line"></i>
											</span>Order<br /> confirmed
										</div>

										<div className={`mn-step mn-step-completed`}>
											<span className="mn-step-indicator">
												<i className="ri-check-line"></i>
											</span>
											<span className="mn-step-icon">
												<i className="ri-settings-5-line"></i>
											</span>Processing<br /> order
										</div>
										<div className={`mn-step mn-step-completed`}>
											<span className="mn-step-icon">
												<i className="ri-gift-line">
												</i>
											</span>Quality<br /> check
										</div>
										<div className={`mn-step mn-step-completed`}>
											<span className="mn-step-icon">
												<i className="ri-truck-line"></i>
											</span>Product<br /> dispatched
										</div>
										<div className={`mn-step mn-step-completed`}>
											<span className="mn-step-icon">
												<i className="ri-home-4-line"></i>
											</span>Product<br /> delivered
										</div>
									</div>
									<div className="mn-steps-header">
										<div className="progress">
											<div className="progress-bar" role="progressbar"
												style={{ width: "19%" }}
												aria-valuenow="19" aria-valuemin="0" aria-valuemax="100"></div>
										</div>
									</div>
								</div> */}
								<div className="mn-steps">
									<div className="mn-steps-body">
										{TrackingSteps.map((step) => {
											let stepClass = "";
											if (step.index < currentStep) {
												stepClass = "mn-step-completed";
											}
											else if (step.index === currentStep) { 
												stepClass = "mn-step-active"; 
											}

											return (
												<div key={step.index} className={`mn-step ${stepClass}`}>

													{step.index < currentStep && (
														<span className="mn-step-indicator">
															<i className="ri-check-line"></i>
														</span>
													)}

													<span className="mn-step-icon">
														<i className={step.icon}></i>
													</span>
													{step.label}
												</div>
											);
										})}
									</div>


									{/* progress bar */}
									<div className="mn-steps-header">
										<div className="progress">
											<div
												className="progress-bar"
												role="progressbar"
												style={{ width: `${(currentStep / 5) * 100}%` }}
												aria-valuenow={(currentStep / 5) * 100}
												aria-valuemin="0"
												aria-valuemax="100"
											></div>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default ViewTracking;

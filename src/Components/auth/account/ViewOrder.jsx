import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BreadCrumb } from "primereact/breadcrumb";
import { cartImageUrlPort, isVideo, serverPort } from "../../Constants"
import './accountstyles.css';
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";


const ViewOrder = ({ data, onBack }) => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const invoiceRef = useRef();
    const [previewImages, setPreviewImages] = useState([]);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/order/${data}`);
            if (res.data.code === 200) {
                setOrder(res.data.data);
                console.log("order", res.data.data);
                setOrderItems(res.data.data.orderItems)
            } else {
                setOrder({});
                setOrderItems([])
            }
        } catch (err) {
            console.error("Error fetching order:", err);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [data]);

    // Breadcrumb items
    const items = [
        {
            label: "Orders",
            command: () => onBack()
        },
        {
            label: data
        }
    ];

    // const handleDownload = () => {
    //     html2canvas(invoiceRef.current).then((canvas) => {
    //         const imgData = canvas.toDataURL("image/png");
    //         const pdf = new jsPDF("p", "mm", "a4");
    //         const imgProps = pdf.getImageProperties(imgData);
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    //         pdf.save(`invoice_order_${data}.pdf`);
    //     });
    // };

    const handleDownload = () => {
        const element = invoiceRef.current;

        const opt = {
            margin: 0.5,
            filename: `invoice_order_${data}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleViewAll = (images) => {
        setModalImages(images);
        setShowImageModal(true);
    };

    const handleCloseModal = () => {
        setShowImageModal(false);
        setModalImages([]);
    };

    return (
        <>
            <div className="breadcrumb-container">
                <BreadCrumb model={items} />
                <button onClick={handleDownload}  className="download-btn mb-2">
                    <i className="pi pi-download d-block d-md-none download-icon" ></i>
                    <span className="d-none d-md-block" title="Download Invoice">Download Invoice</span>
                </button>

            </div>
            {/*  mainpage */}
            <main className="col-12 col-md-9 col-lg-12 main-c">
                <div className="card p-3 shadow-sm" ref={invoiceRef}>
                    <div className="row align-items-center">
                        <div className="col">
                            <h4 className="mb-0">Order Invoice</h4>
                        </div>
                        {/* <div className="col-auto">
                            <button onClick={handleDownload} className="btn btn-success">
                                <i className="pi pi-download d-block d-md-none" ></i>
                                {" "}
                                <span className="d-none d-md-block" title="Download Invoice">Download Invoice</span>
                            </button>
                        </div> */}
                    </div>

                    <hr />
                    <p>
                        <strong>Order ID:</strong> {data}{" "}
                    </p>
                    <p>
                        <strong>Customer Name:</strong> {order?.userAddress?.firstName}{" "}
                        {order?.userAddress?.lastName}
                    </p>
                    <p>
                        <strong>Email:</strong> {order?.accountDetails?.accountEmail}
                    </p>
                    <p>
                        <strong>Phone:</strong> {order?.userAddress?.phone}
                    </p>
                    <p>
                        <strong>Ordered Date:</strong>{" "}
                        {new Date(order?.createdAt).toLocaleString()}
                    </p>
                    <p>
                        <strong>Order Status:</strong> {order?.orderStatus}
                    </p>
                    <p>
                        <strong>Address:</strong> {order?.userAddress?.addressLine1},{" "}
                        {order?.userAddress?.addressLine2}, {order?.userAddress?.city}, {order?.userAddress?.state},{" "}
                        {order?.userAddress?.country}, {order?.userAddress?.pincode}
                    </p>

                    {/* product customization */}
                    {/* <div className="mt-4">
                        <h4>Products Customization Details:</h4>
                        <hr className="no-spacing" />

                        {orderItems?.map((item, idx) => (
                            <div key={idx} className="customization-card">
                                <h5 className="mt-2">{item.product.productName}</h5>
                                <p>
                                    <strong>Custom Item Name:</strong> {item.itemName}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {item.quantity}
                                </p>
                                <p>
                                    <strong>Option Price:</strong> Rs {item.optionPrice}
                                </p>
                                <p>
                                    <strong>Discount:</strong>{" "}
                                    {item.optionDiscount ? item.optionDiscount.toFixed(2) + "%" : "0%"}
                                </p>
                                <p>
                                    <strong>Discount Price:</strong> Rs {item.optionDiscountPrice}
                                </p>
                        
                                {item.product.productCustomization?.customizationOptions?.length > 0 && (
                                    <div className="">
                                        <ul className="options-list">
                                            {item.product.productCustomization.customizationOptions.map(
                                                (opt) => (
                                                    <li key={opt.id}>
                                                        <span>
                                                            <strong>{opt.optionLabel}</strong> – Rs {opt.originalPrice}{" "}
                                                            (Old Price: Rs {opt.oldPrice}, Discount:{" "}
                                                            {opt.discount.toFixed(2)}%)
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div> */}

                    <div className="order-table-container mt-2">
                        <h4>Ordered Items:</h4>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Product Designs</th>
                                    <th>Custom Name</th>
                                    <th>Uploded Custom Image</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems?.map((item, index) => (
                                    <tr key={index}>
                                        <td data-label="Product">
                                            {isVideo(item.product.productUrl) ? (
                                                <video
                                                    src={serverPort + `${item.product.productUrl}`}
                                                    className="product-media"
                                                    onClick={() =>
                                                        navigate(`/product-details/${item.product.productId}`)
                                                    }
                                                />
                                            ) : (
                                                <img
                                                    src={serverPort + item.product.productUrl}
                                                    alt={item.dishName}
                                                    className="product-media"
                                                    onClick={() =>
                                                        navigate(`/product-details/${item.product.productId}`)
                                                    }
                                                />
                                            )}
                                            <span>{item.product.productName}</span>
                                        </td>
                                        <td data-label="Product Designs">
                                            {item.designs && Object.entries(item.designs).length > 0 ? (
                                                Object.entries(item.designs).map(([key, value]) => (
                                                    <div key={value}>
                                                        {key && key.trim() !== "" ? key : "N/A"}
                                                    </div>
                                                ))
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>

                                        <td data-label="Custom Name">
                                            {item?.customName ? item.customName : "N/A"}
                                        </td>
                                        {
                                            item.customImages.length === 0 && (
                                                <td data-label="Uploded Custom Image">
                                                    {"N/A"}
                                                </td>
                                            )
                                        }
                                        {
                                            item.customImages.map((i) => {
                                                return (
                                                    <>
                                                        <td data-label="Uploded Custom Image">
                                                            <img src={cartImageUrlPort + i} alt={i} className="cart-uploaded-image" />
                                                        </td>
                                                    </>
                                                )
                                            })
                                        }

                                        <td data-label="Price">Rs {item.optionPrice}</td>
                                        <td data-label="Quantity">{item.quantity}</td>
                                        <td data-label="Total">Rs {item.quantity * item.optionPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="order-footer desktop-only">
                                {/* <tr>
                                    <td colSpan="6" className="text-right">Sub-Total:</td>
                                    <td>{order?.orderTotal} Rs</td>
                                </tr> */}
                                <tr>
                                    <td colSpan="6" className="text-right">GST (18%):</td>
                                    <td>Rs {order?.orderGstPercent} </td>
                                </tr>
                                <tr>
                                    <td colSpan="6" className="text-right">Shipping Charges:</td>
                                    <td>Rs {order?.orderShippingCharges} </td>
                                </tr>
                                <tr>
                                    <td colSpan="6" className="text-right total-amount">Total Amount:</td>
                                    <td className="total-amount">Rs {order?.orderTotal} </td>
                                </tr>
                            </tfoot>

                        </table>
                        <div className="order-summary">
                            {/* <p><strong>Sub-Total:</strong> {(order?.orderTotal) - ((order?.orderGstPercent) + (order?.orderShippingCharges))}</p> */}
                            <p className="no-spacing"><strong>GST (18%):</strong> {order?.orderGstPercent} Rs</p>
                            <p className="no-spacing"><strong>Shipping Charges:</strong> {order?.orderShippingCharges} Rs</p>
                            <p><strong>Total Amount:</strong> <span>{order?.orderTotal} Rs</span></p>
                        </div>
                    </div>

                    {/* payment details */}
                    <div className="mt-5">
                        <h4>Payment Details:</h4>
                        <hr className="no-spacing" />
                        <p className="mt-2">
                            <strong>Payment ID:</strong> {order?.payment?.paymentId}{" "}
                        </p>
                        <p>
                            <strong>Payment Receipt ID:</strong> {order?.payment?.receipt}{" "}
                        </p>
                        <p>
                            <strong>Razorpay ID:</strong> {order?.payment?.razorpayOrderId}{" "}
                        </p>
                        <p>
                            <strong>Payment Date:</strong> {new Date(order?.createdAt).toLocaleString()}
                        </p>
                        <p>
                            <strong>Status :</strong> {order?.payment?.status} {" "}
                        </p>
                        <p>
                            <strong>Total Amount:</strong> {order?.payment?.amount} {" "} Rs
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ViewOrder;

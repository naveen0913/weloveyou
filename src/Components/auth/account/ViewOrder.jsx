import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BreadCrumb } from "primereact/breadcrumb";

const ViewOrder = ({ data, onBack }) => {
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

    const handleDownload = () => {
        html2canvas(invoiceRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_order_${order?.orderId}.pdf`);
        });
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
            </div>
            {/*  mainpage */}
            <main className="col-12 col-md-9 col-lg-12 main-c">
               

                <div className="card p-4 shadow-sm" ref={invoiceRef}>
                    <div className="row align-items-center">
                        <div className="col">
                            <h4 className="mb-0">Invoice</h4>
                        </div>
                        <div className="col-auto">
                            <button onClick={handleDownload} className="btn btn-success">
                                <i className="pi pi-download" ></i>
                                {" "}
                                <span>Download Invoice</span>
                            </button>
                        </div>
                    </div>

                    <hr />
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

                    {/* <div className="table-responsive mt-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Order No</th>
                                    <th>Product Name</th>
                                    <th>Custom Name</th>
                                    <th>Label Designs</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Custom Images</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartList.map((item, index) => (
                                    <tr key={item.cartItemId || index}>
                                        <td>{index + 1}</td>
                                        <td>{order?.orderId}</td>
                                        <td>
                                            {item.product?.productName} ({item.itemName})
                                        </td>
                                        <td>{item.customName || "-"}</td>
                                        <td>
                                            {Object.keys(item.labelDesigns || {}).join(", ") ||
                                                "NA"}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.optionPrice.toFixed(2)}</td>
                                        <td className="text-center">
                                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                {(() => {
                                                    const validImages = Array.isArray(item.customImages)
                                                        ? item.customImages.filter(
                                                            (img) => img && !img.includes("blob")
                                                        )
                                                        : [];

                                                    if (validImages.length === 0) {
                                                        return (
                                                            <span className="text-muted">No image</span>
                                                        );
                                                    }
                                                    return (
                                                        <>
                                                            {validImages.slice(0, 3).map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={`http://localhost:8081/uploads/${img}`}
                                                                    height="40"
                                                                    width="80"
                                                                    alt={`custom-${idx}`}
                                                                    style={{
                                                                        objectFit: "cover",
                                                                        borderRadius: "4px",
                                                                    }} />
                                                            ))}

                                                            {validImages.length > 3 && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleViewAll(validImages)}>
                                                                    View All
                                                                </button>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex flex-column justify-content-end">
                            <p>
                                <strong>Shipping:</strong> ₹{orderShippingCharges}
                            </p>
                            <p>
                                <strong>GST:</strong> ₹{orderGstPercent}
                            </p>
                            <h5>
                                <strong>Total:</strong> ₹{orderTotal}
                            </h5>
                        </div>
                    </div> */}
                </div>
            </main></>
    );
};

export default ViewOrder;

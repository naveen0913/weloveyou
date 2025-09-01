import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UserCustomImage = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const imgRefs = useRef({});
    const canvasRefs = useRef({});

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/products/${productId}`)
            .then((res) => {
                setProduct(res.data.data.customImageResponse);
            })
            .catch((err) => console.error("Error loading product", err));
    }, [productId]);


    const handleFileChange = (imageId, hotspotIndex, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const uploadImg = new Image();
            uploadImg.crossOrigin = "anonymous";
            uploadImg.onload = () => {
                const imgEl = imgRefs.current[imageId];
                const canvasEl = canvasRefs.current[`${imageId}-${hotspotIndex}`];
                const ctx = canvasEl.getContext("2d");

                canvasEl.width = imgEl.clientWidth;
                canvasEl.height = imgEl.clientHeight;

                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

                // Get hotspot group from backend
                const hotspotGroup = product
                    .find((img) => img.id === imageId)
                    .hotspots[hotspotIndex];

                if (!hotspotGroup || hotspotGroup.length === 0) return;

                const shape = hotspotGroup[0].shape;

                // Convert % coords → px coords
                const coordsPx = hotspotGroup.map((p) => ({
                    x: (p.x / 100) * imgEl.clientWidth,
                    y: (p.y / 100) * imgEl.clientHeight,
                }));

                ctx.beginPath();

                if (shape === "circle") {
                    const [p1, p2] = coordsPx;
                    const radius = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) / 2;
                    ctx.arc((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, radius, 0, Math.PI * 2);
                }
                else if (shape === "oval") {
                    const [p1, p2] = coordsPx;
                    const rx = Math.abs(p2.x - p1.x) / 2;
                    const ry = Math.abs(p2.y - p1.y) / 2;
                    ctx.ellipse((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, rx, ry, 0, 0, Math.PI * 2);
                }
                else if (shape === "square") {
                    const [p1, p2] = coordsPx;
                    const size = Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y));
                    ctx.rect(p1.x, p1.y, Math.sign(p2.x - p1.x) * size, Math.sign(p2.y - p1.y) * size);
                }
                else if (shape === "rectangle") {
                    const [p1, p2] = coordsPx;
                    ctx.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
                }
                else if (shape === "pencil") {
                    ctx.moveTo(coordsPx[0].x, coordsPx[0].y);
                    for (let i = 1; i < coordsPx.length; i++) {
                        ctx.lineTo(coordsPx[i].x, coordsPx[i].y);
                    }
                    ctx.closePath();
                }
                else if (shape === "triangle") {
                    const [p1, p2, p3] = coordsPx;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.closePath();
                }

                ctx.clip();
                ctx.drawImage(uploadImg, 0, 0, canvasEl.width, canvasEl.height);
            };
            uploadImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    const prepareFinalImage = async (imgId) => {
        const imgEl = imgRefs.current[imgId];
        imgEl.crossOrigin = "anonymous";
        const mergedCanvas = document.createElement("canvas");
        mergedCanvas.width = imgEl.clientWidth;
        mergedCanvas.height = imgEl.clientHeight;
        const ctx = mergedCanvas.getContext("2d");

        // Draw base image
        ctx.drawImage(imgEl, 0, 0, mergedCanvas.width, mergedCanvas.height);

        // Draw all overlays
        Object.keys(canvasRefs.current).forEach((key) => {
            if (key.startsWith(`${imgId}-`)) {
                const overlayCanvas = canvasRefs.current[key];
                ctx.drawImage(overlayCanvas, 0, 0);
            }
        });

        return new Promise((resolve) => {
            mergedCanvas.toBlob((blob) => {
                resolve({ blob, base64: mergedCanvas.toDataURL("image/png") });
            }, "image/png");

        });
    };

    const handleSubmit = async (imgId) => {
        const finalImage = await prepareFinalImage(imgId);
        if (finalImage.blob == null) {
            alert("Please Upload image for Preview");
            return;
        }
        console.log("final", finalImage);
        const formData = new FormData();
        formData.append("file", finalImage.blob, "customized.png");
        formData.append("email", "unb1309@outlook.com")

        const res = await axios.post(`http://localhost:8081/api/products/${productId}/custom-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("res", res);

    };

    const resetCustomImage = (imageId, hotspotIndex) => {
        const canvasEl = canvasRefs.current[`${imageId}-${hotspotIndex}`];
        if (canvasEl===null) {
            alert("Upload your Image!");
            return;
        }
        const ctx = canvasEl.getContext("2d");
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    };
    


    if (!product) return <p>Loading...</p>;

    return (
        <div className="m-1 mb-3">
            {product.map((img, imgIndex) => (
                <div key={img.id} className="position-relative d-inline-block">
                    {/* Base product image */}
                    <img
                        ref={(el) => {
                            if (el) {
                                el.crossOrigin = "anonymous";
                                imgRefs.current[img.id] = el;
                            }
                        }}
                        src={`http://localhost:8081${img.imageUrl}`}
                        alt=""
                        className="img-fluid"
                    />
                    {img.hotspots.map((_, hotspotIndex) => (
                        <canvas
                            key={hotspotIndex}
                            ref={(el) => (canvasRefs.current[`${img.id}-${hotspotIndex}`] = el)}
                            className="position-absolute top-0 start-0"
                            style={{ pointerEvents: "none" }}
                        ></canvas>
                    ))}

                    {img.hotspots.map((_, hotspotIndex) => (
                        <div key={hotspotIndex} className="mt-2">
                            <div className="d-flex flex-row gap-2 justify-content-end mb-2">
                                <i className="pi pi-refresh"     onClick={() => resetCustomImage(img.id, hotspotIndex)} 
 ></i>
                                <i className="pi pi-download" onClick={() => handleSubmit(img.id)} ></i>
                            </div>
                            <label
                                htmlFor="mainPhoto"
                                className="fw-semibold mb-1">
                                Upload your Image for Preview
                            </label>
                            <div
                                className="p-2 border rounded text-center position-relative"
                                style={{ borderStyle: "dashed", color: "#aaa" }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-100"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileChange(img.id, hotspotIndex, e)}
                                    id="mainPhoto"
                                />
                                <label
                                    htmlFor="mainPhoto"
                                    style={{ cursor: "pointer" }}>
                                    <div style={{ fontSize: 20, marginBottom: 4 }}>
                                        📤
                                    </div>
                                    Drop your file here, or{" "}
                                    <span className="text-primary">Browse</span>
                                    <div className="small mt-1">
                                        Maximum file size 5MB
                                    </div>
                                </label>
                            </div>

                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}


export default UserCustomImage;
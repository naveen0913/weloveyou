import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { convertToWebP } from "./Constants";

const UserCustomImage = ({ productId, uploadedImage, onCustomDataChange }) => {
    const [product, setProduct] = useState([]);
    const [tableItemsCount, setTableItemsCount] = useState(1);
    const imgRefs = useRef({});
    const canvasRefs = useRef({});

    const [hotspotInputs, setHotspotInputs] = useState({});

    const getProductData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/products/${productId}`
            );
            if (response.data.code === 200) {
                let images = response.data.data.customImageResponse;

                const tableHotspotTemplate = images.find(
                    (img) => img.imageType === "tablesPage" && img.hotspots.length > 0
                )?.hotspots;

                if (tableHotspotTemplate) {
                    images = images.map((img) => {
                        if (img.imageType === "tablesPage" && img.hotspots.length === 0) {
                            return { ...img, hotspots: tableHotspotTemplate };
                        }
                        return img;
                    });
                }

                setProduct(images);
            } else {
                setProduct([]);
            }
        } catch (error) {
            console.error("error", error);
        }
    };

    useEffect(() => {
        if (productId) {
            getProductData();
        }
    }, [productId]);

   

    const handleFileChange = (realId, displayId, hotspotIndex, e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (uploadedImage) uploadedImage(file);
    
        const reader = new FileReader();
        reader.onload = (ev) => {
            const uploadImg = new Image();
            uploadImg.crossOrigin = "anonymous";
            uploadImg.onload = () => {
                const imgEl = imgRefs.current[displayId];
                const canvasEl = canvasRefs.current[`${displayId}-${hotspotIndex}`];
                const ctx = canvasEl.getContext("2d");
    
                canvasEl.width = imgEl.clientWidth;
                canvasEl.height = imgEl.clientHeight;
    
                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    
                const hotspotGroup = product.find((img) => img.id === realId)?.hotspots[hotspotIndex];
                if (!hotspotGroup || hotspotGroup.length === 0) return;
    
                // convert hotspot % → px
                const coordsPx = hotspotGroup.map((p) => ({
                    x: (p.x / 100) * imgEl.clientWidth,
                    y: (p.y / 100) * imgEl.clientHeight,
                }));
    
                let minX = Math.min(...coordsPx.map((p) => p.x));
                let maxX = Math.max(...coordsPx.map((p) => p.x));
                let minY = Math.min(...coordsPx.map((p) => p.y));
                let maxY = Math.max(...coordsPx.map((p) => p.y));
    
                const boxWidth = Math.max(1, Math.round(maxX - minX));
                const boxHeight = Math.max(1, Math.round(maxY - minY));
    
                // cover-fit logic
                const imgRatio = uploadImg.width / uploadImg.height;
                const boxRatio = boxWidth / boxHeight;
    
                let drawW, drawH, offsetX, offsetY;
                if (imgRatio > boxRatio) {
                    drawH = boxHeight;
                    drawW = uploadImg.width * (drawH / uploadImg.height);
                    offsetX = minX + (boxWidth - drawW) / 2;
                    offsetY = minY;
                } else {
                    drawW = boxWidth;
                    drawH = uploadImg.height * (drawW / uploadImg.width);
                    offsetX = minX;
                    offsetY = minY + (boxHeight - drawH) / 2;
                }
    
                // 1. Draw uploaded image first (behind)
                ctx.drawImage(uploadImg, offsetX, offsetY, drawW, drawH);
    
                // 2. Then draw the base background image (in front)
                ctx.drawImage(imgEl, 0, 0, canvasEl.width, canvasEl.height);
            };
            uploadImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };
    

    const getUserImageData = async (name, type, e) => {
        const convertedFile = await convertToWebP(e.target.files[0]);
        if (!convertedFile) return;

        const payload = {
            imageFile: convertedFile,
            imageName: name,
            imageType: type,
        };
        
        if (onCustomDataChange) {
            onCustomDataChange(payload);
        }

    }

    if (!product) return <p>Loading...</p>;

    return (
        <div className="m-1 mb-3">
            {product
                .flatMap((img) => {
                    if (img.imageType === "tablesPage") {
                        return Array.from({ length: tableItemsCount }, (_, idx) => ({
                            ...img,
                            displayId: `${img.id}-${idx}`,
                            realId: img.id,
                            instanceIndex: idx + 1,
                        }));
                    }
                    return [{ ...img, displayId: img.id, realId: img.id }];
                })
                .map((img) => (
                    <div key={img.displayId} className="position-relative d-inline-block">
                        
                        <img
                         onContextMenu={(e)=>e.preventDefault()}
                            ref={(el) => {
                                if (el) {
                                    el.crossOrigin = "anonymous";
                                    imgRefs.current[img.displayId] = el;
                                }
                            }}
                            src={`http://localhost:8081${img.imageUrl}`}
                            alt={img.imageName}
                            className="img-fluid"
                            style={{ width: "100%", maxWidth: "800px",margin:"10px 0" }}
                        />

                        {img.hotspots.map((_, hotspotIndex) => (
                            <canvas
                                key={hotspotIndex}
                                ref={(el) =>
                                    (canvasRefs.current[`${img.displayId}-${hotspotIndex}`] = el)
                                }
                                className="position-absolute top-0 start-0"
                                style={{ pointerEvents: "none" }}
                            ></canvas>
                        ))}

                        {img.hotspots.map((hotspotGroup, hotspotIndex) => (
                            <div key={hotspotIndex}>
                                <label className="fw-semibold mb-1">
                                    {img.imageType === "tablesPage"
                                        ? `Upload Image for ${img.name}`
                                        : `Upload Image for ${img.name}`}
                                </label>
                                <div
                                    className="p-2 border rounded text-center position-relative"
                                    style={{ borderStyle: "dashed", color: "#aaa" }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-100"
                                        style={{ display: "none", }}
                                        onChange={(e) => {
                                            handleFileChange(img.realId, img.displayId, hotspotIndex, e);
                                            getUserImageData(img.name, img.imageType, e);
                                        }}
                                        id={`file-${img.displayId}-${hotspotIndex}`}
                                    />
                                    <label
                                        htmlFor={`file-${img.displayId}-${hotspotIndex}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div style={{ fontSize: 20 }}>📤</div>
                                        Drop your file here, or{" "}
                                        <span className="text-primary">Browse</span>
                                        <div className="small mt-1">Maximum file size 5MB</div>
                                    </label>
                                </div>
                            </div>
                        ))}

                    </div>
                ))}
        </div>
    );
};

export default UserCustomImage;
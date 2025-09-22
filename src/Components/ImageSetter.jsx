import React, { useState, useEffect, useRef } from "react";
import { RadioButton } from "primereact/radiobutton";
import { serverPort } from "./Constants";
import ShowPreview from "./ShowPreview";
import { Dropdown } from "react-bootstrap";

const ProductDesignSelector = ({ productDesigns, onInputsChange, onChangeDesign }) => {
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [inputs, setInputs] = useState({});
    const canvasRef = useRef(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const filteredStickers = productDesigns.filter(d => d.imageType === "sticker");
    const filteredPreview = productDesigns.filter(d => d.imageType === "previewSheet");

    const firstBatch = filteredStickers.slice(0, 12);
    const restBatch = filteredStickers.slice(12);

    const categoryHotspots = {};
    filteredStickers.forEach((design) => {
        if (!categoryHotspots[design.category] && design.hotspots.length > 0) {
            categoryHotspots[design.category] = design.hotspots;
        }
    });

    useEffect(() => {
        if (onInputsChange) {
            onInputsChange(inputs);
        }
    }, [inputs, onInputsChange]);

    const handleDesignChange = (design) => {
        setSelectedDesign(design);
        if (onChangeDesign) {
            onChangeDesign({
                [design.name]: design.id,
            });
        }
    };

    const handleInputChange = (key, value) => {
        if (value instanceof File) {
            const blobUrl = URL.createObjectURL(value);
            setInputs((prev) => ({
                ...prev,
                [key]: { file: value, url: blobUrl }
            }));
        } else {
            setInputs((prev) => ({ ...prev, [key]: value }));
        }
    };


    // useEffect(() => {
    //     if (!selectedDesign) return;
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;

    //     const ctx = canvas.getContext("2d");
    //     const baseImg = new Image();
    //     baseImg.crossOrigin = "anonymous";
    //     baseImg.src = serverPort + selectedDesign.imageUrl;

    //     baseImg.onload = () => {
    //         canvas.width = baseImg.width;
    //         canvas.height = baseImg.height;

    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    //         const hotspots = categoryHotspots[selectedDesign.category] || [];

    //         hotspots.forEach((group, gIndex) => {
    //             const coordsPx = group.map((p) => ({
    //                 x: (p.x / 100) * canvas.width,
    //                 y: (p.y / 100) * canvas.height,
    //             }));

    //             const minX = Math.min(...coordsPx.map((p) => p.x));
    //             const maxX = Math.max(...coordsPx.map((p) => p.x));
    //             const minY = Math.min(...coordsPx.map((p) => p.y));
    //             const maxY = Math.max(...coordsPx.map((p) => p.y));

    //             const boxWidth = maxX - minX;
    //             const boxHeight = maxY - minY;

    //             const key = `${selectedDesign.category}-${gIndex}`;
    //             const value = inputs[key];

    //             if (!value) return;


    //             if (group[0].dataType === "image" && value?.url) {
    //                 const img = new Image();
    //                 img.crossOrigin = "anonymous";
    //                 img.src = value.url;

    //                 img.onload = () => {
    //                     ctx.save();
    //                     ctx.beginPath();
    //                     ctx.rect(minX, minY, boxWidth, boxHeight);
    //                     ctx.clip();

    //                     const imgRatio = img.width / img.height;
    //                     const boxRatio = boxWidth / boxHeight;

    //                     let drawWidth, drawHeight, offsetX, offsetY;

    //                     if (imgRatio > boxRatio) {
    //                         drawHeight = boxHeight;
    //                         drawWidth = img.width * (boxHeight / img.height);
    //                         offsetX = minX + (boxWidth - drawWidth) / 2;
    //                         offsetY = minY;
    //                     } else {
    //                         drawWidth = boxWidth;
    //                         drawHeight = img.height * (boxWidth / img.width);
    //                         offsetX = minX;
    //                         offsetY = minY + (boxHeight - drawHeight) / 2;
    //                     }

    //                     ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    //                     ctx.restore();
    //                     // ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
    //                 };
    //             }


    //             if (group[0].dataType === "text" && typeof value === "string") {
    //                 ctx.save();
    //                 ctx.fillStyle = "black";
    //                 ctx.font = "bold 30px Cambria";
    //                 ctx.textAlign = "left";
    //                 ctx.textBaseline = "top";

    //                 const words = value.split(" ");
    //                 let line = "";
    //                 const lineHeight = 40;
    //                 let y = minY;

    //                 for (let i = 0; i < words.length; i++) {
    //                     const testLine = line + words[i] + " ";
    //                     const metrics = ctx.measureText(testLine);

    //                     if (metrics.width > boxWidth && i > 0) {
    //                         ctx.fillText(line, minX, y);
    //                         line = words[i] + " ";
    //                         y += lineHeight;

    //                         if (y > maxY) break;
    //                     } else {
    //                         line = testLine;
    //                     }
    //                 }

    //                 if (y <= maxY) {
    //                     ctx.fillText(line, minX, y);
    //                 }
    //                 ctx.restore();
    //             }


    //         });
    //     };
    // }, [selectedDesign, inputs, categoryHotspots, serverPort]);

    useEffect(() => {
        if (!selectedDesign) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const baseImg = new Image();
        baseImg.crossOrigin = "anonymous";
        baseImg.src = serverPort + selectedDesign.imageUrl;

        baseImg.onload = () => {
            canvas.width = baseImg.width;
            canvas.height = baseImg.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

            const hotspots = categoryHotspots[selectedDesign.category] || [];
            let imageLoadPromises = [];

            hotspots.forEach((group, gIndex) => {
                const coordsPx = group.map((p) => ({
                    x: (p.x / 100) * canvas.width,
                    y: (p.y / 100) * canvas.height,
                }));

                const minX = Math.min(...coordsPx.map((p) => p.x));
                const maxX = Math.max(...coordsPx.map((p) => p.x));
                const minY = Math.min(...coordsPx.map((p) => p.y));
                const maxY = Math.max(...coordsPx.map((p) => p.y));

                const boxWidth = maxX - minX;
                const boxHeight = maxY - minY;

                const key = `${selectedDesign.category}-${gIndex}`;
                const value = inputs[key];

                if (!value) return;

                if (group[0].dataType === "image" && value?.url) {
                    imageLoadPromises.push(
                        new Promise((resolve) => {
                            const img = new Image();
                            img.crossOrigin = "anonymous";
                            img.src = value.url;

                            img.onload = () => {
                                ctx.save();
                                ctx.beginPath();
                                ctx.rect(minX, minY, boxWidth, boxHeight);
                                ctx.clip();

                                const imgRatio = img.width / img.height;
                                const boxRatio = boxWidth / boxHeight;

                                let sx, sy, sWidth, sHeight;

                                if (imgRatio > boxRatio) {
                                    sHeight = img.height;
                                    sWidth = boxRatio * img.height;
                                    sx = (img.width - sWidth) / 2;
                                    sy = 0;
                                } else {
                                    sWidth = img.width;
                                    sHeight = img.width / boxRatio;
                                    sx = 0;
                                    sy = (img.height - sHeight) / 2;
                                }

                                ctx.drawImage(img, sx, sy, sWidth, sHeight, minX, minY, boxWidth, boxHeight);

                                ctx.restore();
                                resolve();
                            };
                        })
                    );
                }
            });

            // After all images are drawn → draw text
            Promise.all(imageLoadPromises).then(() => {
                hotspots.forEach((group, gIndex) => {
                    const coordsPx = group.map((p) => ({
                        x: (p.x / 100) * canvas.width,
                        y: (p.y / 100) * canvas.height,
                    }));

                    const minX = Math.min(...coordsPx.map((p) => p.x));
                    const maxX = Math.max(...coordsPx.map((p) => p.x));
                    const minY = Math.min(...coordsPx.map((p) => p.y));
                    const maxY = Math.max(...coordsPx.map((p) => p.y));

                    const boxWidth = maxX - minX;

                    const key = `${selectedDesign.category}-${gIndex}`;
                    const value = inputs[key];

                    if (group[0].dataType === "text" && typeof value === "string") {
                        ctx.save();
                        ctx.fillStyle = "black";
                        ctx.font = "bold 30px Cambria";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "top";

                        const words = value.split(" ");
                        let line = "";
                        const lineHeight = 40;
                        let y = minY;

                        for (let i = 0; i < words.length; i++) {
                            const testLine = line + words[i] + " ";
                            const metrics = ctx.measureText(testLine);

                            if (metrics.width > boxWidth && i > 0) {
                                ctx.fillText(line, minX, y);
                                line = words[i] + " ";
                                y += lineHeight;
                                if (y > maxY) break;
                            } else {
                                line = testLine;
                            }
                        }
                        if (y <= maxY) {
                            ctx.fillText(line, minX, y);
                        }
                        ctx.restore();
                    }
                });
            });
        };
    }, [selectedDesign, inputs, categoryHotspots, serverPort]);

    const hasInputData = Object.keys(inputs).some((key) => {
        const value = inputs[key];
        if (!value) return false;
        if (typeof value === "object" && value.file) return true;
        if (typeof value === "string" && value.trim() !== "") return true;
        return false;
    });


    return (
        <div>
            <div className="d-flex flex-wrap gap-3">

                {firstBatch.map((design) => (
                    <label
                        key={design.id}
                        className="form-check-label d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                    >
                        <RadioButton
                            inputId={`opt-${design.id}`}
                            name="designOption"
                            value={design.id}
                            onChange={() => {
                                handleDesignChange(design)
                                setShowMore(false);
                            }}
                            checked={selectedDesign?.id === design.id}
                            className="me-1"
                        />
                        {design.name}
                    </label>
                ))}

                {restBatch.length > 0 && (
                    <Dropdown show={showMore} onToggle={() => setShowMore(!showMore)}>
                        <Dropdown.Toggle
                            variant="secondary"
                            id="dropdown-basic"
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                boxShadow: "none",
                                color: "black",
                            }}
                        >
                            Show More
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto", padding: 0 }}>
                            {restBatch.map((design) => (
                                <Dropdown.Item as="div" key={design.id}>
                                    <label
                                        className="form-check-label d-flex align-items-center"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <RadioButton
                                            inputId={`opt-${design.id}`}
                                            name="designOption"
                                            value={design.id}
                                            onChange={() => {
                                                handleDesignChange(design);
                                                setShowMore(false);
                                            }}
                                            checked={selectedDesign?.id === design.id}
                                            className="me-1"
                                        />
                                        {design.name}
                                    </label>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                )}

            </div>

            {selectedDesign && (
                <div className="mt-4 text-center"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            border: "1px solid #ddd",
                            width: "100%",
                        }}
                    />
                </div>
            )}

            {selectedDesign && categoryHotspots[selectedDesign.category] && (
                <div className=" p-3 bg-light rounded">
                    {categoryHotspots[selectedDesign.category].map((group, gIndex) => {
                        const key = `${selectedDesign.category}-${gIndex}`;
                        if (group[0].dataType === "image") {
                            return (
                                <div key={key} className="mt-3">
                                    <label className="form-label">
                                        Upload Image for Preview
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"

                                        onChange={(e) =>
                                            handleInputChange(key, e.target.files[0])
                                        }
                                    />
                                </div>
                            );
                        } else if (group[0].dataType === "text") {
                            return (
                                <div key={key} className="mt-3">
                                    <label className="form-label">
                                        Enter Data for Preview
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Enter data here`}
                                        value={inputs[key] || ""}
                                        onChange={(e) =>
                                            handleInputChange(key, e.target.value)
                                        }
                                    />

                                </div>
                            );
                        }
                        return null;

                    })}
                    <div className="d-flex flex-row justify-content-end mt-2">
                        {
                            hasInputData && (
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setInputs({});

                                        const canvas = canvasRef.current;
                                        if (canvas) {
                                            const ctx = canvas.getContext("2d");
                                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                                            if (selectedDesign) {
                                                const baseImg = new Image();
                                                baseImg.crossOrigin = "anonymous";
                                                baseImg.src = serverPort + selectedDesign.imageUrl;
                                                baseImg.onload = () => {
                                                    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
                                                };
                                            }
                                        }
                                    }}
                                >Clear
                                </button>
                            )
                        }

                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setShowPreview(true)}
                            disabled={!hasInputData}
                        >
                            Check Preview
                        </button>
                    </div>
                </div>
            )}

            {showPreview && (
                <ShowPreview
                    visible={showPreview}
                    onHide={() => setShowPreview(false)}
                    selectedDesign={selectedDesign}
                    previewSheets={filteredPreview}
                    inputs={inputs}
                    serverPort={serverPort}
                />
            )}

        </div>


    );
};

export default ProductDesignSelector;

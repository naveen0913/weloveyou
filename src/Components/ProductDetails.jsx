import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from 'primereact/radiobutton';
import UserCustomImage from "./UserCustomImage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/Slices/cartSlice";
import ImageGallery from "./Carousel";
import { BaseUrl, convertMultipleToWebP, convertToWebP, serverPort } from "./Constants"
import ProductDesignSelector from "./ImageSetter";


const ProductDetails = () => {

    const { isAuthenticated, user } = useSelector(state => state.auth);
    const userSessionId = user?.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const [options, setOptions] = useState([]);
    const [toggles, setToggles] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [giftWrap, setGiftWrap] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [designOptions, setDesignOptions] = useState([]);
    const [loadingDesigns, setLoadingDesigns] = useState(true);
    const [mainName, setMainName] = useState("");
    const [mainPhoto, setMainPhoto] = useState(null);
    const [sheetData, setSheetData] = useState([]);
    const [countFromOption, setCountFromOption] = useState(1);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [selectedDesigns, setSelectedDesigns] = useState([]);

    const [thumbnails, setThumbnails] = useState([]);
    const [thumbnailImages, setThumbnailImages] = useState(thumbnails);
    const [custom, setCustom] = useState({});
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [tablePreviewData, setTablePreviewData] = useState([]);
    const [productDesigns, setProductDesigns] = useState([]);

    const [selectedThumbnail, setSelectedThumbnail] = useState(thumbnailImages[0]);
    const [selectedDesign, setSelectedDesign] = useState(null);

    const [inputs, setInputs] = useState({});
    const canvasRef = useRef(null);
    const [childInputs, setChildInputs] = useState({});
    const [previews, setPreviews] = useState([]);


    const categoryHotspots = {};
    productDesigns.forEach((design) => {
        if (!categoryHotspots[design.category] && design.hotspots.length > 0) {
            categoryHotspots[design.category] = design.hotspots;
        }
    });

    const handleInputChange = (key, value) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };


    const onDesignChange = (design) => {
        setSelectedDesign(design);
    };

    useEffect(() => {
        if (!selectedDesign) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const baseImg = new Image();
        baseImg.src = serverPort + selectedDesign.imageUrl;

        baseImg.onload = () => {
            canvas.width = baseImg.width;
            canvas.height = baseImg.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

            const hotspots = categoryHotspots[selectedDesign.category] || [];

            hotspots.forEach((group, gIndex) => {
                group.forEach((h, i) => {
                    const key = `${selectedDesign.category}-${gIndex}-${i}`;
                    const x = (h.x / 100) * canvas.width;
                    const y = (h.y / 100) * canvas.height;
                    const w = canvas.width * 0.18;
                    const hgt = canvas.height * 0.08;

                    // If hotspot is image
                    if (h.dataType === "image" && inputs[key] instanceof File) {
                        const img = new Image();
                        img.src = URL.createObjectURL(inputs[key]);
                        img.onload = () => {
                            ctx.drawImage(img, x, y, w, hgt);
                        };
                    }

                    // If hotspot is text
                    if (h.dataType === "text" && typeof inputs[key] === "string") {
                        ctx.fillStyle = "black";
                        ctx.font = "bold 20px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(inputs[key], x + w / 2, y + hgt / 2);
                    }

                    // Debug border (optional)
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, w, hgt);
                });
            });
        };
    }, [selectedDesign, inputs]);



    const handleSelect = (item, index) => {
        console.log("Selected Item:", item);
        setSelectedThumbnail(item);
    };

    const getDesignData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/designs/product/${id}`,
            );
            if (response.status === 200) {
                setProductDesigns(response.data);
            } else {
                setProductDesigns([]);
            }
        } catch (err) {
            console.error("Failed to fetch product customizations:", err);
        } finally {
            setLoading(false);
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/products/${id}`,
            );
            if (response.data.code === 200) {
                const data = response.data.data;
                setProductDesigns(data.productDesigns);
                setProduct(data);
                const customization = data.productCustomization;
                setCustom(customization);
                setThumbnailImages(customization.thumbnailImages)
                setDesignOptions(data.productDesigns);
                setOptions(customization.customizationOptions);
                setToggles({
                    showQuantity: Boolean(customization.quantity),
                    showGiftWrap: Boolean(customization.giftWrap),
                    showCart: Boolean(customization.cart),
                    showInput: Boolean(customization.input),
                    showUpload: Boolean(customization.upload),
                    showUploadMultiple: Boolean(customization.multiUpload),
                    showDesign: Boolean(customization.design),
                });
                // setBannerImageUrl(customization.bannerImageUrl);
                setThumbnails(
                    customization.thumbnailImages
                        ? customization.thumbnailImages.map((img) => img.thumbnailUrl)
                        : [],
                );

                if (customization.customizationOptions?.length > 0) {
                    setSelectedOption(customization.customizationOptions[0]);
                }
                if (data.pCategory) {
                    getRelatedProducts(data.pCategory, data.productId);
                } else {
                    getRelatedProducts([]);
                }
            } else {
                console.error("Product Details not found!")
            }


        } catch (err) {
            console.error("Failed to fetch product customizations:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRelatedProducts = async (category, currentProductId) => {
        try {
            const res = await fetch(`http://localhost:8081/api/products`);
            const data = await res.json();

            if (data.code === 200) {
                const sorted = [...data.data].sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );

                const related = sorted
                    .filter((p) => p.pCategory === category && p.productId !== currentProductId)
                    .slice(0, 3);
                setRelatedProducts(related);
            } else {
                console.error("No Products Found");
            }
        } catch (err) {
            console.error("API Error:", err);
        }
    };

    useEffect(() => {
        fetchData();
        getDesignData();
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            const rotateRightBtn = document.querySelector(
                'button[aria-label="Rotate Right"]',
            );
            const rotateLeftBtn = document.querySelector(
                'button[aria-label="Rotate Left"]',
            );
            if (rotateRightBtn) rotateRightBtn.style.display = "none";
            if (rotateLeftBtn) rotateLeftBtn.style.display = "none";
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!selectedOption?.optionLabel) return;
        const numMatch = selectedOption.optionLabel.match(/^\d+/);
        setCountFromOption(numMatch ? parseInt(numMatch[0], 10) : 1);
    }, [selectedOption]);

    useEffect(() => {
        if (!selectedOption) return;
        const sheetsMatch = selectedOption.optionLabel.match(/(\d+)\s*Sheets?/i);
        const labelsMatch = selectedOption.optionLabel.match(/(\d+)\s*Labels?/i);
        const sheetCount = sheetsMatch
            ? parseInt(sheetsMatch[1], 10)
            : labelsMatch
                ? Math.ceil(parseInt(labelsMatch[1], 10) / 36)
                : 1;
        setSheetData(Array(sheetCount).fill({ design: null }));
    }, [selectedOption]);

    const handleDesignChange = (design, index) => {
        const updated = [...selectedDesigns];
        updated[index] = design;
        setSelectedDesigns(updated);
    };



    const handleMultiUpload = async (e) => {
        const files = Array.from(e.target.files);
        // Converting all to webp
        const webpFiles = await convertMultipleToWebP(files);
        const previews = webpFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setPreviews((prev) => [...prev, ...previews])
        setUploadedPhotos((prev) => [...prev, ...webpFiles]);
    };

    const handleRemovePhoto = (index) => {
        setPreviews((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleInputsUpdate = (updatedInputs) => {
        console.log("child", childInputs);
        setChildInputs(updatedInputs);
    };

    const handleDesignSelect = (designObj) => {
        setSelectedDesigns((prev) => ({
            ...prev,
            ...designObj,
        }));
    };

    const handleCustomDataChange = (customData) => {
        console.log("customer preview image files", customData);
        setTablePreviewData((pre) => [...pre, customData]);

    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const savePreviewData = async (tablePreviewData) => {
        const dataWithBase64 = await Promise.all(
            tablePreviewData.map(async (item) => ({
                ...item,
                imageFile: item.imageFile ? await fileToBase64(item.imageFile) : null,
            }))
        );
        if (tablePreviewData.length > 0) {
            localStorage.setItem("previewData", JSON.stringify(dataWithBase64));
        }
    };

    const addCart = async (selectedOption, userId, id) => {
        
        if (!isAuthenticated) {
            toast.error("User not identified. Please log in again.");
            navigate('/login');
            return;
        }
        if ((product.pCategory === "Stickers" || product.pCategory === "Pencils") && !selectedOption) {
            alert("Select an option first.");
            return;
        }

        if (toggles.showUploadMultiple) {
            if (uploadedPhotos.length === 0 && tablePreviewData.length === 0) {
                alert("Please upload at least 1 photo!");
                return;
            }
        }
        await savePreviewData(tablePreviewData);

        const formData = new FormData();
        let hasImage = false;

        let effectiveMainPhoto = mainPhoto;
        if (childInputs?.["Stickers-0"]?.file instanceof File) {
            effectiveMainPhoto = childInputs["Stickers-0"].file;
        }

        // append main photo
        if (effectiveMainPhoto instanceof File) {
            formData.append("customImages", effectiveMainPhoto);
            hasImage = true;
        }
        uploadedPhotos.forEach((photoObj) => {
            if (photoObj instanceof File) {
                formData.append("customImages", photoObj);
                hasImage = true;
            } else if (photoObj?.file instanceof File) {
                formData.append("customImages", photoObj.file);
                hasImage = true;
            }
        })

        if (!hasImage) {
            formData.append("customImages", new File([], "empty.jpg"));
        }

        const cartItemDesigns = product.pCategory === "Tables Book" || "Pencils" ? {} : selectedDesigns;

        const totalPrice = (quantity * selectedOption.originalPrice).toFixed(2);
        const payload = {
            cartItemName: selectedOption.optionLabel,
            cartQuantity: quantity,
            cartGiftWrap: giftWrap,
            customName: childInputs?.["Stickers-1"],
            customClass: childInputs?.["Stickers-2"],
            customSec: childInputs?.["Stickers-3"],
            customRollno: childInputs?.["Stickers-4"],
            customSubject: childInputs?.["Stickers-5"],
            customSchool: childInputs?.["Stickers-6"],
            optionCount: countFromOption,
            optionPrice: selectedOption.originalPrice,
            optiondiscountPrice: selectedOption.oldPrice,
            optiondiscount: selectedOption.discount,
            totalPrice: totalPrice,
            cartItemDesigns: cartItemDesigns,
            mainPhoto: effectiveMainPhoto || null,
            uploadedPhotos: uploadedPhotos || []
        };

        formData.append("cartPayload", JSON.stringify(payload));
        for (let [key, value] of formData.entries()) {
            console.log(`formData -> ${key}:`, value);
        }
        try {
            dispatch(addToCart({ selectedOption, userId, productId: id, payload }));
        } catch (error) {
            console.error("Error in adding cart", err);
        }
    };

    return (

        <div className="mn-main-content">
            <div className="mn-breadcrumb m-b-30">
                <div className="row">
                    <div className="col-12">
                        <div className="row gi_breadcrumb_inner">
                            <div className="col-md-6 col-sm-12">
                                <h2 className="mn-breadcrumb-title">Product Detail Page</h2>
                            </div>
                            <div className="col-md-6 col-sm-12">

                                <ul className="mn-breadcrumb-list">
                                    <li className="mn-breadcrumb-item" onClick={() => navigate('/')} >Home</li>
                                    <li className="mn-breadcrumb-item" onClick={() => navigate('/products')} >Products</li>
                                    <li className="mn-breadcrumb-item active">Product Detail Page</li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xxl-12">
                    <section className="">
                        <div className="">
                            <div className="main-p-container">

                                <ImageGallery
                                    images={thumbnailImages}
                                    selected={selectedThumbnail}
                                    onItemSelect={handleSelect}
                                />


                                <div className="product-details-container">
                                    <h3 className="mn-single-title">
                                        {product.productName}
                                    </h3>

                                    {toggles.showDesign && (
                                        <div className="mn-single-sales">
                                            <div className="mn-single-sales-inner">

                                                <div>
                                                    {[...Array(selectedOption?.optionSheetCount)].map(
                                                        (_, index) => (
                                                            <div key={index}>
                                                                <h6 className="mt-3">
                                                                    Choose Design Option{" "} for label Sheet {" "}
                                                                    {selectedOption?.optionSheetCount > 1
                                                                        ? index + 1
                                                                        : ""}
                                                                </h6>
                                                                <hr />


                                                                <div>
                                                                    <ProductDesignSelector
                                                                        productDesigns={productDesigns}
                                                                        onInputsChange={handleInputsUpdate}
                                                                        onChangeDesign={handleDesignSelect}
                                                                    />                                                                </div>

                                                                {selectedDesigns[index]?.designImages?.length > 0 && (
                                                                    <div className="design-preview fade-in d-flex flex-wrap gap-3 mb-2">
                                                                        {selectedDesigns[index].designImages.map((img) => (
                                                                            <div key={img.imageId}>

                                                                                <img src={`http://localhost:8081${img.designUrl}`} alt=""
                                                                                    width="500"
                                                                                    imageStyle={{
                                                                                        objectFit: "cover",
                                                                                    }} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}


                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(product.pCategory === "Pencils" || product.pCategory === "Stickers") && (
                                        <div className="mb-2 mt-3">
                                            <h5 className="text-center mb-2">Choose Your Option</h5>
                                            {options.map((opt, idx) => (
                                                <div
                                                    key={opt.id || idx}
                                                    className={`border rounded p-3 mb-3 ${selectedOption === opt
                                                        ? "border-primary border-3 bg-light"
                                                        : "border-secondary"
                                                        }`}>
                                                    <div className="">
                                                        <div className="d-flex flex-row gap-3 justify-content-between align-items-center">
                                                            <label htmlFor="opt">
                                                                <RadioButton className="me-2" inputId="opt" onChange={() => setSelectedOption(opt)} checked={selectedOption === opt} />
                                                                <span
                                                                    style={{ whiteSpace: "nowrap", flex: 1, fontWeight: "500" }}>
                                                                    {opt.optionLabel}
                                                                </span>

                                                                <span style={{ fontWeight: "500" }}> ({opt.optionSheetCount}) </span>
                                                            </label>

                                                            {opt.mostPopular && (
                                                                <span className="badge bg-warning text-dark p-2">
                                                                    Most Popular
                                                                </span>
                                                            )}

                                                            {opt.discount !== null && (
                                                                <span className="badge bg-success d-block p-2">
                                                                    {opt.discount?.toFixed(2)}% Off
                                                                </span>
                                                            )}

                                                        </div>


                                                        <div className="mt-1 text-md-end text-start">

                                                            {opt.oldPrice !== 0 && (
                                                                <div className="text-muted text-decoration-line-through">
                                                                    ₹{opt.oldPrice?.toFixed(2)}
                                                                </div>
                                                            )}
                                                            <div className="fw-semibold text-primary">
                                                                ₹{opt.originalPrice.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {product.pCategory === "Tables Book" && (
                                        <div className="mb-3 table-book-c">
                                            {
                                                options.map((opt, i) => (
                                                    <div key={i} className="d-flex flex-row gap-3">
                                                        {opt.discount !== null && (
                                                            <span className="d-block">
                                                                {opt.discount?.toFixed(2)}% Off
                                                            </span>
                                                        )}
                                                        {opt.oldPrice !== 0 && (
                                                            <div className="text-muted text-decoration-line-through">
                                                                ₹{opt.oldPrice?.toFixed(2)}
                                                            </div>
                                                        )}

                                                        <div className="fw-bold text-primary">
                                                            ₹{opt.originalPrice.toFixed(2)}
                                                        </div>

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}

                                    {toggles.showUploadMultiple && (
                                        <div className="mb-3">
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <h6 className="card-title">Upload up to 24 Photos</h6>
                                                    <div
                                                        className="border border-2 border-secondary-subtle rounded p-3 text-center"
                                                        style={{ borderStyle: "dashed" }}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="form-control mb-2"
                                                            id="multiPhotoUpload"
                                                            onChange={handleMultiUpload}
                                                        />
                                                    </div>

                                                    {/* Preview Section */}
                                                    <div className="d-flex flex-wrap gap-1 mt-2">
                                                        {previews.map((photo, index) => (
                                                            <div
                                                                key={index}
                                                                className="position-relative"
                                                            >
                                                                <img
                                                                    src={photo.previewUrl}
                                                                    alt={`preview-${index}`}
                                                                    style={{
                                                                        width: "80px",
                                                                        height: "80px",
                                                                        objectFit: "cover",
                                                                        border: "1px solid #ddd",
                                                                    }}
                                                                />

                                                                <i className="pi pi-trash position-absolute" style={{
                                                                    top: "2px",
                                                                    right: "2px",
                                                                    color: "red",
                                                                    background: "white",
                                                                    borderRadius: "50%",
                                                                    padding: "4px",
                                                                    cursor: "pointer",
                                                                    fontSize: "14px",
                                                                }} onClick={() => handleRemovePhoto(index)} ></i>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* {product?.pCategory === "Stickers" && toggles.showUpload && (
                                        <UserCustomImage
                                            productId={id}
                                            uploadedImage={imageFromChild}
                                            onCustomDataChange={handleCustomDataChange}
                                        />
                                    )} */}

                                    {
                                        product.pCategory === "Tables Book" && (
                                            <div className="text-center fw-semibold">
                                                (Or)
                                            </div>
                                        )
                                    }


                                    {product?.pCategory === "Tables Book" && toggles.showUploadMultiple && (
                                        <div className="user-preview-container">
                                            <UserCustomImage
                                                productId={id}
                                                uploadedImage={null}
                                                onCustomDataChange={handleCustomDataChange}
                                            />
                                        </div>

                                    )}


                                    {toggles.showInput && (product?.pCategory === "Pencils") && (
                                        <div className="mb-3">
                                            <label htmlFor="mainName" className="fw-semibold mb-1">
                                                Enter Your Name
                                            </label>
                                            <input
                                                id="mainName"
                                                type="text"
                                                className="form-control mb-2 h-75"
                                                placeholder="enter name"
                                                value={mainName}
                                                onChange={(e) => setMainName(e.target.value)}
                                            />
                                        </div>
                                    )}




                                    <div className="d-flex flex-row  gap-2 mb-3">
                                        <Checkbox id="giftWrap" onChange={() => setGiftWrap((prev) => !prev)} checked={giftWrap}></Checkbox>
                                        <label
                                            className="form-check-label"
                                            htmlFor="giftWrap">
                                            🎁 Gift Wrap
                                        </label>
                                    </div>

                                    <div className="mn-single-qty">
                                        <div className="qty-plus-minus">
                                            <i className="pi pi-minus" style={{ fontSize: ".8rem" }}
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            ></i>
                                            <input className="qty-input" type="text" name="ms_qtybtn" disabled
                                                value={quantity} />
                                            <i className="pi pi-plus" style={{ fontSize: ".8rem" }}
                                                onClick={() => setQuantity((q) => q + 1)}
                                            ></i>
                                        </div>
                                        <div className="mn-btns">
                                            <div className="mn-single-cart">
                                                <button
                                                    onClick={() => {
                                                        addCart(selectedOption, userSessionId, id)
                                                    }}

                                                    className="btn btn-primary mn-btn-2 mn-add-cart"><span>
                                                        {isAuthenticated ? "Add To Cart" : "Login to Add Cart"}
                                                    </span></button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="mn-single-pro-tab r">
                                        <div className="mn-single-pro-tab-wrapper">
                                            <div className="mn-single-pro-tab-nav">
                                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                    <li className="nav-item" role="presentation">
                                                        <button className="nav-link active" id="details-tab"
                                                            data-bs-toggle="tab" data-bs-target="#mn-spt-nav-details"
                                                            type="button" role="tab" aria-controls="mn-spt-nav-details"
                                                            aria-selected="true">Detail</button>
                                                    </li>
                                                </ul>

                                            </div>
                                            <div className="tab-content  mn-single-pro-tab-content">
                                                <div id="mn-spt-nav-details" className="tab-pane fade show active">
                                                    <div className="mn-single-pro-tab-desc">
                                                        <p>
                                                            {product.productdescription}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}


                                </div>



                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>


    )
}

export default ProductDetails;
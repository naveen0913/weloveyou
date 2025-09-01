import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Gallery from "./Gallery";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from 'primereact/radiobutton';
import { Image } from "primereact/image";
import UserCustomImage from "./UserCustomImage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/Slices/cartSlice";


const ProductDetails = () => {

    const { isAuthenticated, user } = useSelector(state => state.auth);
    const userSessionId = user?.data?.id;
    const navigation = useNavigate();
    const dispatch = useDispatch();


    const { id } = useParams();
    const [options, setOptions] = useState([]);
    const [toggles, setToggles] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [giftWrap, setGiftWrap] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [bannerImageUrl, setBannerImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [designOptions, setDesignOptions] = useState([]);
    const [loadingDesigns, setLoadingDesigns] = useState(true);
    const [mainName, setMainName] = useState("");
    const [mainPhoto, setMainPhoto] = useState(null);
    const [sheetData, setSheetData] = useState([]);
    const [countFromOption, setCountFromOption] = useState(1);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [mainPhotoPreview, setMainPhotoPreview] = useState(null);

    const [selectedDesignId, setSelectedDesignId] = useState(null);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [selectedDesigns, setSelectedDesigns] = useState([]);

    const [thumbnails, setThumbnails] = useState([]);
    const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(null);
    const [thumbnailImages, setThumbnailImages] = useState(thumbnails);
    const [overlays, setOverlays] = useState({});
    const fileInputRef = useRef(null);
    const [custom, setCustom] = useState({});
    const [product, setProduct] = useState({});

    const role = localStorage.getItem("role");
    // const userId = localStorage.getItem("userId");
    const isAdmin = role === "admin";
    const [relatedProducts, setRelatedProducts] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/products/${id}`,
            );
            if (response.data.code === 200) {
                const data = response.data.data;
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
                setBannerImageUrl(customization.bannerImageUrl);
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
            setError("Failed to load product customizations.");
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


    // const addToCart = async () => {

    //     if (!isAuthenticated) {
    //         toast.error("User not identified. Please log in again.");
    //         navigation('/login');
    //         return;
    //     }
    //     if (!selectedOption) {
    //         toast.warning("Select an option first.");
    //         return;
    //     }
    //     if (toggles.showInput && !mainName.trim()) {
    //         toast.error("Please enter a name.");
    //         return;
    //     }

    //     if (toggles.showUploadMultiple && uploadedPhotos.length === 0) {
    //         toast.error("Please upload at least one additional photo.");
    //         return;
    //     }


    //     const cartItemDesigns = {};
    //     selectedDesigns.forEach((design) => {
    //         if (design && design.designName && design.designId != null) {
    //             cartItemDesigns[design.designName] = design.designId;
    //         }
    //     });
    //     const totalPrice = (quantity * selectedOption.originalPrice).toFixed(2);
    //     const item = {
    //         cartItemName: selectedOption.optionLabel,
    //         cartQuantity: quantity,
    //         cartGiftWrap: giftWrap,
    //         customName: mainName,
    //         optionCount: countFromOption,
    //         optionPrice: selectedOption.originalPrice,
    //         optiondiscountPrice: selectedOption.oldPrice,
    //         optiondiscount: selectedOption.discount,
    //         totalPrice: totalPrice,
    //         // labelDesigns: labelDesigns,
    //         cartItemDesigns: cartItemDesigns,
    //     };

    //     const formData = new FormData();
    //     formData.append("cartPayload", JSON.stringify(item));
    //     let hasImage = false;
    //     if (mainPhoto instanceof File) {
    //         formData.append("customImages", mainPhoto);
    //         hasImage = true;
    //     }
    //     uploadedPhotos.forEach((file) => {
    //         if (file instanceof File) {
    //             formData.append("customImages", file);
    //             hasImage = true;
    //         }
    //     });
    //     if (!hasImage) {
    //         formData.append("customImages", new File([], ""));
    //     }
    //     for (let [key, value] of formData.entries()) {
    //         console.log(`${key}:`, value);
    //     }
    //     console.log("form", formData);
    //     try {
    //         const response = await axios.post(
    //             `http://localhost:8081/api/cart/add/${selectedOption.id}/${userSessionId}/${id}`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             },
    //         );
    //         if (response.data.code === 201) {
    //             toast.success("Item added to cart successfully!", {
    //                 autoClose: 500,
    //                 position: "top-right",
    //             });
    //         } else {
    //             toast.error("Failed to add item. Try again.");
    //         }
    //     } catch (error) {
    //         console.error("Error adding to cart:", error);
    //         toast.error("Something went wrong while adding to cart.");
    //     }
    // };

    const addCart = async (selectedOption,userId,id,) => {
        if (!isAuthenticated) {
            toast.error("User not identified. Please log in again.");
            navigation('/login');
            return;
        }
        if (!selectedOption) {
            toast.warning("Select an option first.");
            return;
        }
        if (toggles.showInput && !mainName.trim()) {
            toast.error("Please enter a name.");
            return;
        }
        const formData = new FormData();
        let hasImage = false;
        if (mainPhoto instanceof File) {
            formData.append("customImages", mainPhoto);
            hasImage = true;
        }
        uploadedPhotos.forEach((file) => {
            if (file instanceof File) {
                formData.append("customImages", file);
                hasImage = true;
            }
        });
        if (!hasImage) {
            formData.append("customImages", new File([], ""));
        }
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        const cartItemDesigns = {};
        selectedDesigns.forEach((design) => {
            if (design && design.designName && design.designId != null) {
                cartItemDesigns[design.designName] = design.designId;
            }
        });
        const totalPrice = (quantity * selectedOption.originalPrice).toFixed(2);
        const payload = {
        cartItemName: selectedOption.optionLabel,
        cartQuantity: quantity,
        cartGiftWrap: giftWrap,
        customName: mainName,
        optionCount: countFromOption,
        optionPrice: selectedOption.originalPrice,
        optiondiscountPrice: selectedOption.oldPrice,
        optiondiscount: selectedOption.discount,
        totalPrice: totalPrice,
        cartItemDesigns: cartItemDesigns,
        };
        console.log("payload",payload);
        dispatch(addToCart({ selectedOption, userId, productId: id, payload }));

    }



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
                                {/* <!-- mn-breadcrumb-list start --> */}
                                <ul className="mn-breadcrumb-list">
                                    <li className="mn-breadcrumb-item"><a href="/home">Home</a></li>
                                    <li className="mn-breadcrumb-item active">Product Detail Page</li>
                                </ul>
                                {/* <!-- mn-breadcrumb-list end --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xxl-12">
                    <section className="mn-single-product">
                        <div className="row">
                            <div className="mn-pro-rightside mn-common-rightside col-lg-9 col-md-12 m-b-15">
                                {/* <!-- Single product content Start --> */}



                                <div className="single-pro-block">
                                    <div className="single-pro-inner">
                                        <div className="row">

                                            {/* <div className="single-pro-img">
                                                <div className="single-product-scroll">
                                                    <div className="single-product-cover">
                                                        <div className="single-slide zoom-image-hover">
                                                            <img className="img-responsive" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQefv-EQBVmicVIzhjn-SyioTT8-RA4DIvTlw&s"
                                                                alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="single-nav-thumb">
                                                        <div className="single-slide">
                                                            <img className="img-responsive" src="assets/img/product/27.jpg"
                                                                alt="" />
                                                        </div>
                                                        <div className="single-slide">
                                                            <img className="img-responsive" src="assets/img/product/28.jpg"
                                                                alt="" />
                                                        </div>
                                                        <div className="single-slide">
                                                            <img className="img-responsive" src="assets/img/product/29.jpg"
                                                                alt="" />
                                                        </div>
                                                        <div className="single-slide">
                                                            <img className="img-responsive" src="assets/img/product/30.jpg"
                                                                alt="" />
                                                        </div>
                                                        <div className="single-slide">
                                                            <img className="img-responsive" src="assets/img/product/29.jpg"
                                                                alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <Gallery thumbnailImages={thumbnailImages} />

                                            <div className="single-pro-desc m-t-991">
                                                <div className="single-pro-content">
                                                    <h5 className="mn-single-title">
                                                        {product.productName}
                                                    </h5>
                                                    {/* ratings block*/}
                                                    {/* <div className="mn-single-rating-wrap">
                                                        
                                                        <div className="mn-single-rating mn-pro-rating">
                                                            <i className="ri-star-fill"></i>
                                                            <i className="ri-star-fill"></i>
                                                            <i className="ri-star-fill"></i>
                                                            <i className="ri-star-fill"></i>
                                                            <i className="ri-star-fill grey"></i>
                                                        </div>
                                                        <span className="mn-read-review">
                                                            |&nbsp;&nbsp;<a href="#mn-spt-nav-review">992 Ratings</a>
                                                        </span>
                                                    </div> */}

                                                    {/* price block */}
                                                    {/* <div className="mn-single-price-stoke">
                                                        <div className="mn-single-price">
                                                            <div className="final-price">$664.00<span
                                                                className="price-des">-78%</span>
                                                            </div>
                                                            <div className="mrp">M.R.P. : <span>$2,999.00</span></div>
                                                        </div>
                                                        <div className="mn-single-stoke">
                                                            <span className="mn-single-sku">SKU#: WH12</span>
                                                            <span className="mn-single-ps-title">IN STOCK</span>
                                                        </div>
                                                    </div> */}

                                                    {/* estimation delivery */}
                                                    {/* <div className="mn-single-sales">
                                                        <div className="mn-single-sales-inner">

                                                            <div className="mn-single-sales-visitor">🚚 Estimated Delivery by
                                                                <span> Thu, 28 Aug 2025</span>
                                                            </div>
                                                        </div>
                                                    </div> */}


                                                    <div className="mn-single-sales">
                                                        <div className="mn-single-sales-inner">

                                                            <div className="mb-1">
                                                                <h5 className="text-center mb-2">Choose Your Option</h5>
                                                                {options.map((opt, idx) => (
                                                                    <div
                                                                        key={opt.id || idx}
                                                                        className={`border rounded p-3 mb-3 ${selectedOption === opt
                                                                            ? "border-primary border-3 bg-light"
                                                                            : "border-secondary"
                                                                            }`}>
                                                                        <div className="row align-items-center">
                                                                            <div className="col-md-4 col-12 mb-2 mb-md-0">
                                                                                <label htmlFor="opt" className="d-flex justify-content-between align-items-center w-100">

                                                                                    <RadioButton className="me-2" inputId="opt" onChange={() => setSelectedOption(opt)} checked={selectedOption === opt} />

                                                                                    <span
                                                                                        className="fw-bold"
                                                                                        style={{ whiteSpace: "nowrap", flex: 1 }}>
                                                                                        {opt.optionLabel}
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                            <div className="col-md-4 col-12 text-center">
                                                                                {opt.discount !== null && (
                                                                                    <span className="badge bg-success d-block">
                                                                                        {opt.discount?.toFixed(2)}% Off
                                                                                    </span>
                                                                                )}
                                                                                {opt.mostPopular && (
                                                                                    <span className="badge bg-warning text-dark">
                                                                                        Most Popular
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-md-4 col-12 text-md-end text-start">
                                                                                <div className="fw-bold text-primary">
                                                                                    ₹{opt.originalPrice.toFixed(2)}
                                                                                </div>
                                                                                {opt.oldPrice !== 0 && (
                                                                                    <div className="text-muted text-decoration-line-through">
                                                                                        ₹{opt.oldPrice?.toFixed(2)}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {selectedOption && (
                                                                <div className="text-end fw-semibold">
                                                                    Total: ₹{(quantity * selectedOption.originalPrice).toFixed(2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>


                                                    {toggles.showDesign && (
                                                        <div className="mn-single-sales">
                                                            <div className="mn-single-sales-inner">
                                                                <div >
                                                                    {[...Array(selectedOption?.optionSheetCount)].map(
                                                                        (_, index) => (
                                                                            <div key={index}>
                                                                                <h6 className="mb-1">
                                                                                    Choose Design Option{" "} for label
                                                                                    {selectedOption?.optionSheetCount > 1
                                                                                        ? index + 1
                                                                                        : ""}
                                                                                </h6>
                                                                                <hr className="no-spacing" />

                                                                                {selectedDesigns[index]?.designImages?.length > 0 && (
                                                                                    <div className="design-preview fade-in d-flex flex-wrap gap-3 mt-1">
                                                                                        {selectedDesigns[index].designImages.map((img) => (
                                                                                            <div key={img.imageId}>
                                                                                                <Image
                                                                                                    src={`http://localhost:8081${img.designUrl}`}
                                                                                                    alt="design preview"
                                                                                                    preview
                                                                                                    width="100"
                                                                                                    height="100"
                                                                                                    imageStyle={{
                                                                                                        objectFit: "cover",
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )}

                                                                                <div className="d-flex flex-wrap gap-1 mt-1">
                                                                                    {designOptions.map((design) => (
                                                                                        <label
                                                                                            key={design.designId}
                                                                                            className="form-check-label d-flex align-items-center mb-3"
                                                                                            style={{
                                                                                                minWidth: "fit-content",
                                                                                                cursor: "pointer",
                                                                                            }}>

                                                                                            <RadioButton className="me-1" inputId="opt" onChange={() =>
                                                                                                handleDesignChange(design, index)
                                                                                            } checked={
                                                                                                selectedDesigns[index]?.designId ===
                                                                                                design.designId
                                                                                            } />


                                                                                            {design.designName}
                                                                                        </label>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {
                                                        toggles.showUpload && (
                                                            <UserCustomImage productId={id} />
                                                        )
                                                    }


                                                    {/* <div className="mn-single-list">
                                                        <ul>
                                                            <li><strong>Closure :</strong> Hook & Loop</li>
                                                            <li><strong>Sole :</strong> Polyvinyl Chloride</li>
                                                            <li><strong>Width :</strong> Medium</li>
                                                            <li><strong>Outer Material :</strong> A-Grade Standard
                                                                Quality</li>
                                                        </ul>
                                                    </div> */}

                                                    <div className="d-flex flex-row gap-2 mb-3">

                                                        <Checkbox id="giftWrap" onChange={() => setGiftWrap((prev) => !prev)} checked={giftWrap}></Checkbox>
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="giftWrap">
                                                            🎁 Gift Wrap
                                                        </label>
                                                    </div>


                                                    {/* <div className="mn-pro-variation"> */}
                                                    {/* sizes */}
                                                    {/* <div
                                                            className="mn-pro-variation-inner mn-pro-variation-size m-b-24">
                                                            <span>Size</span>
                                                            <div className="mn-pro-variation-content">
                                                                <ul>
                                                                    <li className="active"><span>s</span></li>
                                                                    <li><span>m</span></li>
                                                                    <li><span>l</span></li>
                                                                    <li><span>xl</span></li>
                                                                </ul>
                                                            </div>
                                                        </div> */}
                                                    {/* colors */}
                                                    {/* <div className="mn-pro-variation-inner mn-pro-variation-color">
                                                            <span>Colors</span>
                                                            <div className="mn-pro-variation-content">
                                                                <ul>
                                                                    <li className="active"><span
                                                                        style={{ backgroundColor: "#1b4a87" }}
                                                                    ></span>
                                                                    </li>
                                                                    <li><span style={{ backgroundColor: "#5f94d6" }} ></span>
                                                                    </li>
                                                                    <li><span style={{ backgroundColor: "#72aea2" }} ></span>
                                                                    </li>
                                                                    <li><span style={{ backgroundColor: "#c79782" }} ></span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div> */}
                                                    {/* </div> */}
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
                                                                    onClick={()=>{
                                                                        addCart(selectedOption,userSessionId,id)
                                                                    }}
                                                                    // onClick={addToCart}

                                                                    className="btn btn-primary mn-btn-2 mn-add-cart"><span>
                                                                        {isAuthenticated ? "Add To Cart" : "Login to Add Cart"}
                                                                    </span></button>
                                                            </div>
                                                            <div className="mn-single-wishlist">
                                                                <a href="javascript:void(0)"
                                                                    className="mn-btn-group wishlist mn-wishlist"
                                                                    title="Wishlist">
                                                                    <i className="ri-heart-line"></i>
                                                                </a>
                                                            </div>
                                                            {/* compare icon */}
                                                            <div className="mn-single-mn-compare">
                                                                {/* <a href="javascript:void(0)"
                                                                    className="mn-btn-group mn-compare" title="Quick view">
                                                                    <i className="ri-repeat-line"></i>
                                                                </a> */}


                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* <!--Single product content End -->
                            <!-- Add More and get discount content Start --> */}

                                <div className="single-add-more m-tb-30">
                                    <div className="mn-add-more-slider owl-carousel">
                                        <div className="add-more-item">
                                            <a href="javascript:void(0)" className="mn-btn-2"><span>+</span></a>
                                            <div className="add-more-img">
                                                <img src="assets/img/product/1.jpg" alt="product" />
                                            </div>
                                            <div className="add-more-info">
                                                <h5>Honey Spiced Nuts</h5>
                                                <span className="mn-pro-rating">
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill grey"></i>
                                                    <i className="ri-star-fill grey"></i>
                                                </span>
                                                <span className="mn-price">
                                                    <span className="new-price">$32.00</span>
                                                    <span className="old-price">$45.00</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="add-more-item">
                                            <a href="javascript:void(0)" className="mn-btn-2"><span>+</span></a>
                                            <div className="add-more-img">
                                                <img src="assets/img/product/31.jpg" alt="product" />
                                            </div>
                                            <div className="add-more-info">
                                                <h5>Dates Value Pouch</h5>
                                                <span className="mn-pro-rating">
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                </span>
                                                <span className="mn-price">
                                                    <span className="new-price">$56.00</span>
                                                    <span className="old-price">$60.00</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="add-more-item">
                                            <a href="javascript:void(0)" className="mn-btn-2"><span>+</span></a>
                                            <div className="add-more-img">
                                                <img src="assets/img/product/17.jpg" alt="product" />
                                            </div>
                                            <div className="add-more-info">
                                                <h5>Graps Mix Snack</h5>
                                                <span className="mn-pro-rating">
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill grey"></i>
                                                    <i className="ri-star-fill grey"></i>
                                                    <i className="ri-star-fill grey"></i>
                                                </span>
                                                <span className="mn-price">
                                                    <span className="new-price">$28.00</span>
                                                    <span className="old-price">$35.00</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="add-more-item">
                                            <a href="javascript:void(0)" className="mn-btn-2"><span>+</span></a>
                                            <div className="add-more-img">
                                                <img src="assets/img/product/35.jpg" alt="product" />
                                            </div>
                                            <div className="add-more-info">
                                                <h5>Roasted Almonds Pack</h5>
                                                <span className="mn-pro-rating">
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                    <i className="ri-star-fill"></i>
                                                </span>
                                                <span className="mn-price">
                                                    <span className="new-price">$16.00</span>
                                                    <span className="old-price">$23.00</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Single product tab start --> */}
                                <div className="mn-single-pro-tab">
                                    <div className="mn-single-pro-tab-wrapper">
                                        <div className="mn-single-pro-tab-nav">
                                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link active" id="details-tab"
                                                        data-bs-toggle="tab" data-bs-target="#mn-spt-nav-details"
                                                        type="button" role="tab" aria-controls="mn-spt-nav-details"
                                                        aria-selected="true">Detail</button>
                                                </li>
                                                {/* <li className="nav-item" role="presentation">
                                                    <button className="nav-link" id="info-tab" data-bs-toggle="tab"
                                                        data-bs-target="#mn-spt-nav-info" type="button" role="tab"
                                                        aria-controls="mn-spt-nav-info"
                                                        aria-selected="false">Specifications</button>
                                                </li> */}
                                                {/* <li className="nav-item" role="presentation">
                                                    <button className="nav-link" id="vendor-tab" data-bs-toggle="tab"
                                                        data-bs-target="#mn-spt-nav-vendor" type="button" role="tab"
                                                        aria-controls="mn-spt-nav-vendor"
                                                        aria-selected="false">Vendor</button>
                                                </li> */}
                                                {/* <li className="nav-item" role="presentation">
                                                    <button className="nav-link" id="review-tab" data-bs-toggle="tab"
                                                        data-bs-target="#mn-spt-nav-review" type="button" role="tab"
                                                        aria-controls="mn-spt-nav-review"
                                                        aria-selected="false">Reviews</button>
                                                </li> */}
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
                                            <div id="mn-spt-nav-info" className="tab-pane fade">
                                                <div className="mn-single-pro-tab-moreinfo">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting
                                                        industry.
                                                        Lorem Ipsum has been the industry's standard dummy text ever
                                                        since the
                                                        1500s, when an unknown printer took a galley of type and
                                                        scrambled it to
                                                        make a type specimen book. It has survived not only five
                                                        centuries.
                                                    </p>
                                                    <ul>
                                                        <li><span>Model</span> SKU140</li>
                                                        <li><span>Weight</span> 500 g</li>
                                                        <li><span>Dimensions</span> 35 × 30 × 7 cm</li>
                                                        <li><span>Color</span> Black, Pink, Red, White</li>
                                                        <li><span>Size</span> 10 X 20</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div id="mn-spt-nav-vendor" className="tab-pane fade">
                                                <div className="mn-single-pro-tab-moreinfo">
                                                    <div className="mn-product-vendor">
                                                        <div className="mn-vendor-info">
                                                            <span>
                                                                <img src="assets/img/vendor/1.jpg" alt="vendor" />
                                                            </span>
                                                            <div>
                                                                <h5>Ocean Crate</h5>
                                                                <p>Products : 358</p>
                                                                <p>Sales : 5587</p>
                                                            </div>
                                                        </div>
                                                        <div className="mn-detail">
                                                            <ul>
                                                                <li><span>Phone No. :</span> +00 987654321</li>
                                                                <li><span>Email. :</span> Example@gmail.com</li>
                                                                <li><span>Address. :</span> 2548 Broaddus Maple Court,
                                                                    Madisonville
                                                                    KY 4783, USA.</li>
                                                            </ul>
                                                            <p className="mb-0">Lorem Ipsum is simply dummy text of the
                                                                printing and
                                                                typesetting
                                                                industry.
                                                                Lorem Ipsum has been the industry's standard dummy text
                                                                ever since
                                                                the
                                                                1500s, when an unknown printer took a galley of type and
                                                                scrambled
                                                                it to
                                                                make a type specimen book. It has survived not only five
                                                                centuries,
                                                                but also
                                                                the leap into electronic typesetting, remaining
                                                                essentially
                                                                unchanged.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="mn-spt-nav-review" className="tab-pane fade">
                                                <div className="row">
                                                    <div className="mn-t-review-wrapper mt-0">
                                                        <div className="mn-t-review-item">
                                                            <div className="mn-t-review-avtar">
                                                                <img src="assets/img/user/1.jpg" alt="user" />
                                                            </div>
                                                            <div className="mn-t-review-content">
                                                                <div className="mn-t-review-top">
                                                                    <div className="mn-t-review-name">Mariya Lykra</div>
                                                                    <div className="mn-t-review-rating mn-pro-rating">
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill grey"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="mn-t-review-bottom">
                                                                    <p>Lorem Ipsum is simply dummy text of the printing
                                                                        and
                                                                        typesetting industry. Lorem Ipsum has been the
                                                                        industry's
                                                                        standard dummy text ever since the 1500s, when
                                                                        an unknown
                                                                        printer took a galley of type and scrambled it
                                                                        to make a
                                                                        type specimen.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mn-t-review-item">
                                                            <div className="mn-t-review-avtar">
                                                                <img src="assets/img/user/2.jpg" alt="user" />
                                                            </div>
                                                            <div className="mn-t-review-content">
                                                                <div className="mn-t-review-top">
                                                                    <div className="mn-t-review-name">Moris Willson</div>
                                                                    <div className="mn-t-review-rating mn-pro-rating">
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill grey"></i>
                                                                        <i className="ri-star-fill grey"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="mn-t-review-bottom">
                                                                    <p>Lorem Ipsum has been the industry's
                                                                        standard dummy text ever since the 1500s, when
                                                                        an unknown
                                                                        printer took a galley of type and scrambled it
                                                                        to make a
                                                                        type specimen.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="mn-ratting-content">
                                                        <h3>Add a Review</h3>
                                                        <div className="mn-ratting-form">
                                                            <form action="#">
                                                                <div className="mn-ratting-star">
                                                                    <span>Your rating:</span>
                                                                    <div className="mn-t-review-rating mn-pro-rating">
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill"></i>
                                                                        <i className="ri-star-fill grey"></i>
                                                                        <i className="ri-star-fill grey"></i>
                                                                        <i className="ri-star-fill grey"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="mn-ratting-input">
                                                                    <input name="your-name" placeholder="Name"
                                                                        type="text" />
                                                                </div>
                                                                <div className="mn-ratting-input">
                                                                    <input name="your-email" placeholder="Email*"
                                                                        type="email" required />
                                                                </div>
                                                                <div className="mn-ratting-input form-submit">
                                                                    <textarea name="your-commemt"
                                                                        placeholder="Enter Your Comment"></textarea>
                                                                    <button className="mn-btn-2" type="submit"
                                                                        value="Submit"><span>Submit</span></button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Related products Section --> */}
                                {/* <section className="mn-related-product m-t-30">
                                    <div className="mn-title">
                                        <h2>Related <span>Products</span></h2>
                                    </div>
                                    <div className="mn-related owl-carousel">

                                        <div className="mn-product-card">
                                            <div className="mn-product-img">
                                                <div className="mn-img">
                                                    <a href="product-detail.html" className="image">
                                                        <img className="main-img" src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                                            alt="product" />
                                                        <img className="hover-img" src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                                            alt="product" />
                                                    </a>
                                                    <div className="mn-pro-loader"></div>
                                                    <div className="mn-options">
                                                        <ul>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Quick View" data-link-action="quickview"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#quickview_modal"><i
                                                                    className="ri-eye-line"></i></a></li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Compare" className="mn-compare"><i
                                                                    className="ri-repeat-line"></i></a>
                                                            </li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Add To Cart" className="mn-add-cart"><i
                                                                    className="ri-shopping-cart-line"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mn-product-detail">
                                                <div className="cat">
                                                    <a href="shop-right-sidebar.html">Shoes</a>
                                                    <ul>
                                                        <li>7</li>
                                                        <li>8</li>
                                                        <li>10</li>
                                                    </ul>
                                                </div>
                                                <h5><a href="#">Special sport shoes</a></h5>
                                                <div className="mn-price">
                                                    <div className="mn-price-new">$55</div>
                                                </div>
                                                <div className="mn-pro-option">
                                                    <div className="mn-pro-color">
                                                        <ul className="mn-opt-swatch mn-change-img">
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/9.jpg"
                                                                data-src-hover="assets/img/product/9.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ background: "#0e0e0e" }}
                                                                ></span></a>
                                                            </li>
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/10.jpg"
                                                                data-src-hover="assets/img/product/10.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ background: "#c54367" }}

                                                                ></span></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <a href="javascript:void(0);" className="mn-wishlist active"
                                                        data-tooltip title="Wishlist">
                                                        <i className="ri-heart-line"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mn-product-card">
                                            <div className="mn-product-img">
                                                <div className="lbl">
                                                    <span className="new">new</span>
                                                </div>
                                                <div className="mn-img">
                                                    <a href="product-detail.html" className="image">
                                                        <img className="main-img" src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                                            alt="product" />
                                                        <img className="hover-img" src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                                            alt="product" />
                                                    </a>
                                                    <div className="mn-pro-loader"></div>
                                                    <div className="mn-options">
                                                        <ul>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Quick View" data-link-action="quickview"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#quickview_modal"><i
                                                                    className="ri-eye-line"></i></a></li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Compare" className="mn-compare"><i
                                                                    className="ri-repeat-line"></i></a>
                                                            </li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Add To Cart" className="mn-add-cart"><i
                                                                    className="ri-shopping-cart-line"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mn-product-detail">
                                                <div className="cat">
                                                    <a href="shop-right-sidebar.html">Top</a>
                                                    <ul>
                                                        <li>s</li>
                                                        <li>m</li>
                                                    </ul>
                                                </div>
                                                <h5><a href="#">Cotton fabric Top</a></h5>
                                                <div className="mn-price">
                                                    <div className="mn-price-new">$120</div>
                                                    <div className="mn-price-old">$130</div>
                                                </div>
                                                <div className="mn-pro-option">
                                                    <div className="mn-pro-color">
                                                        <ul className="mn-opt-swatch mn-change-img">
                                                            <li className="active"><a href="#" className="mn-opt-clr-img active"
                                                                data-src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                                                data-src-hover="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                                                data-tooltip="Gray"><span
                                                                    style={{ backgroundColor: '#f3f3f3' }}
                                                                ></span></a>
                                                            </li>
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/2.jpg"
                                                                data-src-hover="assets/img/product/4.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ backgroundColor: '#e8c2ff' }}
                                                                ></span></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <a href="javascript:void(0);" className="mn-wishlist" data-tooltip
                                                        title="Wishlist">
                                                        <i className="ri-heart-line"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mn-product-card">
                                            <div className="mn-product-img">
                                                <div className="lbl">
                                                    <span className="sale">sale</span>
                                                </div>
                                                <div className="mn-img">
                                                    <a href="product-detail.html" className="image">
                                                        <img className="main-img" src="assets/img/product/11.jpg"
                                                            alt="product" />
                                                        <img className="hover-img" src="assets/img/product/12.jpg"
                                                            alt="product" />
                                                    </a>
                                                    <div className="mn-pro-loader"></div>
                                                    <div className="mn-options">
                                                        <ul>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Quick View" data-link-action="quickview"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#quickview_modal"><i
                                                                    className="ri-eye-line"></i></a></li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Compare" className="mn-compare"><i
                                                                    className="ri-repeat-line"></i></a>
                                                            </li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Add To Cart" className="mn-add-cart"><i
                                                                    className="ri-shopping-cart-line"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mn-product-detail">
                                                <div className="cat">
                                                    <a href="shop-right-sidebar.html">watches</a>
                                                </div>
                                                <h5><a href="#">Mantu smart watch</a></h5>
                                                <div className="mn-price">
                                                    <div className="mn-price-new">$955</div>
                                                    <div className="mn-price-old">$999</div>
                                                </div>
                                                <div className="mn-pro-option">
                                                    <div className="mn-pro-color">
                                                        <ul className="mn-opt-swatch mn-change-img">
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/11.jpg"
                                                                data-src-hover="assets/img/product/12.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ background: "#f3f3f3" }}
                                                                // style="background-color:#f3f3f3;"
                                                                ></span></a>
                                                            </li>
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/12.jpg"
                                                                data-src-hover="assets/img/product/11.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ background: "#242424" }}
                                                                // style="background-color:#242424;"
                                                                ></span></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <a href="javascript:void(0);" className="mn-wishlist" data-tooltip
                                                        title="Wishlist">
                                                        <i className="ri-heart-line"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mn-product-card">
                                            <div className="mn-product-img">
                                                <div className="lbl">
                                                    <span className="discount">20% off</span>
                                                </div>
                                                <div className="mn-img">
                                                    <a href="product-detail.html" className="image">
                                                        <img className="main-img" src="assets/img/product/13.jpg"
                                                            alt="product" />
                                                        <img className="hover-img" src="assets/img/product/14.jpg"
                                                            alt="product" />
                                                    </a>
                                                    <div className="mn-pro-loader"></div>
                                                    <div className="mn-options">
                                                        <ul>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Quick View" data-link-action="quickview"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#quickview_modal"><i
                                                                    className="ri-eye-line"></i></a></li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Compare" className="mn-compare"><i
                                                                    className="ri-repeat-line"></i></a>
                                                            </li>
                                                            <li><a href="javascript:void(0)" data-tooltip
                                                                title="Add To Cart" className="mn-add-cart"><i
                                                                    className="ri-shopping-cart-line"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mn-product-detail">
                                                <div className="cat">
                                                    <a href="shop-right-sidebar.html">belt</a>
                                                </div>
                                                <h5><a href="#">Mantu leather belt</a></h5>
                                                <div className="mn-price">
                                                    <div className="mn-price-new">$10</div>
                                                    <div className="mn-price-old">$12</div>
                                                </div>
                                                <div className="mn-pro-option">
                                                    <div className="mn-pro-color">
                                                        <ul className="mn-opt-swatch mn-change-img">
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/13.jpg"
                                                                data-src-hover="assets/img/product/14.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ background: '#d48a5b' }}
                                                                // style="background-color:#d48a5b;"
                                                                ></span></a>
                                                            </li>
                                                            <li><a href="#" className="mn-opt-clr-img"
                                                                data-src="assets/img/product/14.jpg"
                                                                data-src-hover="assets/img/product/13.jpg"
                                                                data-tooltip="Orange"><span
                                                                    style={{ background: '#242424' }}
                                                                // style="background-color:#242424;"
                                                                ></span></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <a href="javascript:void(0);" className="mn-wishlist" data-tooltip
                                                        title="Wishlist">
                                                        <i className="ri-heart-line"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </section> */}

                            </div>
                            {/* <!-- Sidebar Area Start --> */}
                            <div className="mn-shop-sidebar col-lg-3 col-md-12 m-t-991">
                                <div id="shop_sidebar">
                                    <div className="mn-sidebar-wrap">
                                        {/* <!-- Sidebar Filters Block --> */}
                                        <div className="mn-sidebar-block drop">
                                            <div className="mn-sb-title">
                                                <h3 className="mn-sidebar-title">Filters</h3>
                                            </div>
                                            <div className="mn-sb-block-content p-t-15">
                                                <ul>
                                                    <li>
                                                        <a href="javascript:void(0)"
                                                            className="mn-sidebar-block-item main drop">clothes</a>
                                                        <ul style={{ display: "block" }} >
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a href="#">Men
                                                                    <span>-25</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a href="#">Women
                                                                    <span>-52</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a href="#">Boy
                                                                    <span>-40</span></a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <a href="javascript:void(0)"
                                                            className="mn-sidebar-block-item main drop">cosmetics</a>
                                                        <ul>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Shampoo
                                                                    <span>-25</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Body Wash
                                                                    <span>-52</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Sunscreen
                                                                    <span>-40</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Makeup
                                                                    <span>-35</span></a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <a href="shop-right-sidebar.html"
                                                            className="mn-sidebar-block-item main">shoes<span>-15</span></a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <a href="shop-right-sidebar.html"
                                                            className="mn-sidebar-block-item main">bag<span>-27</span></a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <a href="javascript:void(0)"
                                                            className="mn-sidebar-block-item main drop">electronics</a>
                                                        <ul>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Laptop
                                                                    <span>-25</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Air Conditioner
                                                                    <span>-52</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Trimmer
                                                                    <span>-40</span></a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="mn-sidebar-sub-item"><a
                                                                    href="shop-right-sidebar.html">Watches
                                                                    <span>-35</span></a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* <!-- Sidebar Brand Block --> */}
                                        <div className="mn-sidebar-block">
                                            <div className="mn-sb-title">
                                                <h3 className="mn-sidebar-title">Brand</h3>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            {/* <input type="checkbox" checked /> */}
                                                            <input type="checkbox" defaultChecked />

                                                            <a href="javascript:void(0)">
                                                                <span>Zencart Mart</span>
                                                            </a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" />
                                                            <a href="javascript:void(0)">
                                                                <span>Xeta Store</span>
                                                            </a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" />
                                                            <a href="javascript:void(0)">
                                                                <span>Pili Market</span>
                                                            </a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" />
                                                            <a href="javascript:void(0)">
                                                                <span>Indiana Store</span>
                                                            </a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* <!-- Sidebar Weight Block --> */}
                                        <div className="mn-sidebar-block">
                                            <div className="mn-sb-title">
                                                <h3 className="mn-sidebar-title">Size</h3>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" defaultChecked />
                                                            <a href="#">S - Size</a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <a href="#">M - Size</a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <a href="#">L - Size</a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <a href="#">XL - Size</a>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* <!-- Sidebar Color item --> */}
                                        <div className="mn-sidebar-block color-block mn-sidebar-block-clr">
                                            <div className="mn-sb-title">
                                                <h3 className="mn-sidebar-title">Color</h3>
                                            </div>
                                            <div className="mn-sb-block-content">
                                                <ul>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#c4d6f9" }}

                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#ff748b" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#000000" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li className="active">
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#2bff4a" }}

                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#ff7c5e" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#f155ff" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#ffef00" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#c89fff" }}

                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#7bfffa" }}

                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#56ffc1" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#ffdb9f" }}

                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#9f9f9f" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="mn-sidebar-block-item">
                                                            <input type="checkbox" value="" />
                                                            <span className="mn-clr-block"
                                                                style={{ backgroundColor: "#6556ff" }}
                                                            ></span>
                                                            <span className="checked"></span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* <!-- Sidebar Price Block --> */}
                                        <div className="mn-sidebar-block">
                                            <div className="mn-sb-title">
                                                <h3 className="mn-sidebar-title">Price</h3>
                                            </div>
                                            <div className="mn-sb-block-content mn-price-range-slider es-price-slider">
                                                <div className="mn-price-filter">
                                                    <div className="mn-price-input">
                                                        <label className="filter__label">
                                                            From<input type="text" className="filter__input" />
                                                        </label>
                                                        <span className="mn-price-divider"></span>
                                                        <label className="filter__label">
                                                            To<input type="text" className="filter__input" />
                                                        </label>
                                                    </div>
                                                    <div id="mn-sliderPrice" className="filter__slider-price" data-min="0"
                                                        data-max="250" data-step="10"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- Sidebar tags --> */}
                                        <div className="mn-sidebar-block">
                                            <div className="mn-sb-title">
                                                <h3 className="mn-sidebar-title">Tags</h3>
                                            </div>
                                            <div className="mn-tag-block mn-sb-block-content">
                                                <a href="shop-right-sidebar.html"><span>Clothes</span></a>
                                                <a href="shop-right-sidebar.html"><span>Fruits</span></a>
                                                <a href="shop-right-sidebar.html"><span>Snacks</span></a>
                                                <a href="shop-right-sidebar.html"><span>Dairy</span></a>
                                                <a href="shop-right-sidebar.html"><span>Seafood</span></a>
                                                <a href="shop-right-sidebar.html"><span>Fastfood</span></a>
                                                <a href="shop-right-sidebar.html"><span>Toys</span></a>
                                            </div>
                                        </div>
                                    </div>
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
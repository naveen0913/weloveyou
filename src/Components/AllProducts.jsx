import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';
import { ProductCategories } from "./Constants";
import { ProgressSpinner } from "primereact/progressspinner";
import { ToastContainer, toast } from "react-toastify";

const AllProducts = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [processing, setProcessing] = useState(false);
    const toastRef = useRef();

    const getProducts = async () => {
        setProcessing(true)
        try {
            const res = await fetch("http://localhost:8081/api/products");
            const data = await res.json();
            if (data.code === 200) {
                setProcessing(false);
                setProducts(data.data);
                setFilteredProducts(data.data);
            } else {
                setProcessing(false);
                console.error("No Products Found");
                setProducts([]);
                setFilteredProducts([]);
            }
        } catch (err) {
            setProcessing(false);
            console.error("API Error:", err);
            // toast.error("Something went Wrong!")
            setProducts(DummyProducts);
            setFilteredProducts(DummyProducts)
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter((p) => p.pCategory === selectedCategory)
            );
        }
    }, [selectedCategory, products]);

    return (

        <>
            <div>
                {processing && (
                    <div className="overlay-screen">
                        <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="3" />
                    </div>
                )}
            </div>
            <ToastContainer />

            <div className="mn-main-content">
                <div className="mn-breadcrumb m-b-30">
                    <div className="row">
                        <div className="col-12">
                            <div className="row gi_breadcrumb_inner">
                                <div className="col-md-6 col-sm-12">
                                    <h2 className="mn-breadcrumb-title">Products</h2>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <ul className="mn-breadcrumb-list">
                                        <li className="mn-breadcrumb-item"><a onClick={() => navigate("/")}>Home</a></li>
                                        <li className="mn-breadcrumb-item active">Products</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-c-container">
                    <div className="long-caption">
                        Discover a range of love-filled, love-wrapped, and love-crafted products made for kids’ love-filled well-being and love-filled happiness. From love-inspired toys that spark love-driven imagination to love-infused essentials that ensure love-filled comfort, our lovable collection is designed with love, endless love, and nothing but love!
                    </div>
                    <div className="short-caption">
                        Because every child deserves a world full of love, love, and more love!
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-12">
                        {/* <!-- Shop section --> */}
                        <section className="mn-shop">
                            <div className="row">
                                {/* <!-- Sidebar Area Start --> */}
                                <div className="filter-sidebar-overlay"></div>
                                <div className="mn-shop-sidebar mn-filter-sidebar col-lg-3 col-md-12">
                                    <div id="shop_sidebar">
                                        <div className="mn-sidebar-wrap">
                                            {/* <!-- Sidebar Filters Block --> */}
                                            <div className="mn-sidebar-block drop">
                                                <div className="mn-sb-title">
                                                    <h3 className="mn-sidebar-title">Filters</h3>
                                                    <a href="javascript:void(0)" className="filter-close"><i className="ri-close-large-line"></i></a>
                                                </div>
                                                <div className="mn-sb-block-content p-t-15">
                                                    <ul>
                                                        <li>
                                                            <a href="javascript:void(0)"
                                                                className="mn-sidebar-block-item main drop">clothes</a>
                                                            <ul
                                                                // style="display: block;"
                                                                style={{ display: "block" }}
                                                            >
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
                                                                <input type="checkbox" defaultChecked />
                                                                <a href="javascript:void(0)">
                                                                    <span>Zencart Mart</span>
                                                                </a>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <a href="javascript:void(0)">
                                                                    <span>Xeta Store</span>
                                                                </a>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <a href="javascript:void(0)">
                                                                    <span>Pili Market</span>
                                                                </a>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
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
                                                                <input type="checkbox" defaultChecked />
                                                                <a href="#">S - Size</a>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <a href="#">M - Size</a>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <a href="#">L - Size</a>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
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
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#c4d6f9" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    // style="background-color:#ff748b;"
                                                                    style={{ background: "#ff748b" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#000000" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li className="active">
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#2bff4a" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#ff7c5e" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#f155ff" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#ffef00" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#c89fff" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#7bfffa" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#56ffc1" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#ffdb9f" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#9f9f9f" }}
                                                                ></span>
                                                                <span className="checked"></span>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="mn-sidebar-block-item">
                                                                <input type="checkbox" defaultChecked />
                                                                <span className="mn-clr-block"
                                                                    style={{ background: "#6556ff" }}
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

                                <div className="mn-shop-rightside col-md-12 m-t-991">
                                    {
                                        filteredProducts.length !== 0 && (
                                            <div className="mn-pro-list-top d-flex">
                                                <div className="col-md-6 mn-grid-list">
                                                    <div className="mn-gl-btn">
                                                        {/* filter icon */}
                                                        {/* <button className="grid-btn filter-toggle-icon">
                                                    <i className="ri-filter-2-line"></i></button> */}
                                                        <button
                                                            className={`grid-btn btn-grid-50 ${viewMode === "grid" ? "active" : ""}`}
                                                            onClick={() => setViewMode("grid")}
                                                        >
                                                            <i className="ri-gallery-view-2"></i>
                                                        </button>
                                                        <button
                                                            className={`grid-btn hide-mobile-view btn-list-50 ${viewMode === "list" ? "active" : ""}`}
                                                            onClick={() => setViewMode("list")}
                                                        >
                                                            <i className="ri-list-check-2"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* sort by filter */}
                                                {/* <div className="col-md-6 mn-sort-select">
            <div className="mn-select-inner">
                <div className="mn-select-inner">
                    <select
                        name="mn-select"
                        id="mn-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="" disabled>
                            Sort by
                        </option>
                        <option value="1">Position</option>
                        <option value="2">Relevance</option>
                        <option value="3">Name, A to Z</option>
                        <option value="4">Name, Z to A</option>
                        <option value="5">Price, low to high</option>
                        <option value="6">Price, high to low</option>
                    </select>
                </div>
            </div>
        </div> */}
                                            </div>
                                        )
                                    }

                                    {
                                        filteredProducts.length !== 0 && (
                                            <div className="mn-select-bar d-flex">
                                                {ProductCategories.map((cat) => (
                                                    <span
                                                        title={cat}
                                                        key={cat}
                                                        className={`mn-select-btn btn-padding ${selectedCategory === cat ? "btn-padding-active" : ""}`}
                                                        onClick={() => setSelectedCategory(cat)}
                                                    >
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    }

                                    {/* {
                                        filteredProducts.length === 0 && (
                                            <div className="empty-product-container">
                                                <img src="images/EmptyProducts.png" alt="empty-image" className="empty-products-image" />
                                            </div>
                                        )
                                    } */}

                                    {/* <!-- Shop content Start --> */}
                                    <div className="shop-pro-content">
                                        <div className="shop-pro-inner">
                                            <div className="row">
                                                {filteredProducts && filteredProducts.length > 0 && (
                                                    filteredProducts.map((p, i) => {
                                                        return (
                                                            <div
                                                                key={p.productId}
                                                                className={`${viewMode === "grid"
                                                                    ? "col-lg-4 col-md-6 col-sm-6 col-12 mb-4 px-4"
                                                                    : "col-md-6 mb-4 px-2"} mn-product-box pro-gl-content`}
                                                            >
                                                                <div onClick={() => navigate(`/product-details/${p.productId}`)} className={`mn-product-card ${viewMode === "list" ? "d-flex flex-row gap-3" : ""}`}>
                                                                    <div className="mn-product-img">
                                                                        {/* <div className="lbl">
                        <span className="new">new</span>
                    </div> */}
                                                                        <div className="mn-img">
                                                                            <a onClick={() => navigate(`/product-details/${p.productId}`)} className="image">
                                                                                {p.productUrl?.endsWith(".mp4") ? (
                                                                                    <video
                                                                                        className="main-video"
                                                                                        src={p.productUrl}
                                                                                        controls
                                                                                        loop />
                                                                                ) : (
                                                                                    <>
                                                                                        <img className="main-img" src={p.productUrl} alt="product" />
                                                                                        <img className="hover-img" src={p.productUrl} alt="product" />
                                                                                    </>
                                                                                )}
                                                                            </a>

                                                                            <div className="mn-pro-loader"></div>
                                                                            <div className="mn-options">
                                                                                <ul>
                                                                                    <li><a onClick={() => navigate(`/product-details/${p.productId}`)} data-tooltip
                                                                                        title="Quick View"
                                                                                        data-link-action="quickview"
                                                                                        data-bs-toggle="modal"
                                                                                        data-bs-target="#quickview_modal"><i
                                                                                            className="ri-eye-line"></i></a></li>

                                                                                    {/* <li><a href="javascript:void(0)" data-tooltip
                        title="Compare" className="mn-compare"><i
                            className="ri-repeat-line"></i></a></li> */}

                                                                                    {/* <li>
                                                                                        <a href="javascript:void(0)" data-tooltip
                                                                                        title="Add To Cart" className="mn-add-cart"><i
                                                                                            className="ri-shopping-cart-line"></i></a>
                                                                                    </li> */}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mn-product-detail">
                                                                        <div className="cat">
                                                                            <a href="shop-right-sidebar.html">{p.pCategory}</a>
                                                                        </div>

                                                                        <div className={`${viewMode === "list" ? "d-flex flex-column justify-content-start gap-2" : "d-flex flex-row justify-content-between align-items-center"} `}>
                                                                            <h5><a href="#">{p.productName}</a></h5>
                                                                            {viewMode === 'list' && (
                                                                                <p>
                                                                                    {p.productdescription}
                                                                                </p>
                                                                            )}

                                                                            {viewMode === 'grid' && (
                                                                                <a href="javascript:void(0);" className="mn-wishlist"
                                                                                    data-tooltip title="Wishlist">
                                                                                    <i className="ri-heart-line"></i>
                                                                                </a>
                                                                            )}
                                                                        </div>

                                                                        <p className="mn-info">{p.productdescription}</p>
                                                                        {/* <div className="mn-price">
                    <div className="mn-price-new">$120</div>
                    <div className="mn-price-old">$130</div>
                </div> */}
                                                                        {/* <div className="mn-pro-option">
                        <div className="mn-pro-color">
                            <ul className="mn-opt-swatch mn-change-img">
                                <li><a href="#" className="mn-opt-clr-img"
                                    data-src="assets/img/product/17.jpg"
                                    data-src-hover="assets/img/product/18.jpg"
                                    data-tooltip="Orange"><span
                                        style={{ backgroundColor: "#eee" }}
                                    ></span></a>
                                </li>

                            </ul>
                        </div>
                        <a href="javascript:void(0);" className="mn-wishlist"
                            data-tooltip title="Wishlist">
                            <i className="ri-heart-line"></i>
                        </a>
                    </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}

                                            </div>
                                        </div>
                                        {/* <!-- Pagination Start --> */}
                                        {
                                            filteredProducts.length !== 0 && (
                                                <div className="mn-pro-pagination m-b-15">
                                                    <span>Showing {filteredProducts.length} out of {products.length} item(s)</span>
                                                    {/* <ul className="mn-pro-pagination-inner">
        <li><a className="active" href="#">1</a></li>
        <li><a href="#">2</a></li>
        <li><a href="#">3</a></li>
        <li><span>...</span></li>
        <li><a href="#">8</a></li>
        <li><a className="next" href="#">Next <i
            className="ri-arrow-right-double-line"></i></a>
        </li>
    </ul> */}
                                                </div>
                                            )
                                        }

                                    </div>
                                    {/* <!--Shop content End --> */}

                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>

    )

}

export default AllProducts;
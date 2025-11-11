import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';
import { BaseUrl, ProductCategories, prodUrl } from "./Constants";
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
            const res = await fetch(prodUrl+"products");
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
            {/* <div>
                {processing && (
                    <div className="overlay-screen">
                        <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="3" />
                    </div>
                )}
            </div> */}
            <ToastContainer />

            <div className="mn-main-content">
                <div className="mn-breadcrumb m-b-30">
                    <div className="row">
                        <div className="col-12">
                            <div className="row gi_breadcrumb_inner mt-3">
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
                               

                                <div className="mn-shop-rightside col-md-12 m-t-991">
                                 {/* {
                                        filteredProducts.length !== 0 && (
                                            <div className="mn-pro-list-top d-flex">
                                                <div className="col-md-6 mn-grid-list">
                                                    <div className="mn-gl-btn">
                                                        
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
                                               
                                            </div>
                                        )
                                    } */}

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
                                                                                            className="ri-eye-line"></i></a>
                                                                                    </li>
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
                                                                       
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}

                                            </div>
                                        </div>
                                        
                                        {
                                            filteredProducts.length !== 0 && (
                                                <div className="mn-pro-pagination m-b-15">
                                                    <span>Showing {filteredProducts.length} out of {products.length} item(s)</span>
                                                   
                                                </div>
                                            )
                                        }

                                    </div>

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
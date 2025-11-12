import { useEffect, useState } from "react";
import Slider from "./Slider";
import { Link, useNavigate } from "react-router-dom";
import BottomSlider from "./BottomSlider";
import { BaseUrl, isVideo, prodUrl, serverPort } from "./Constants";
import { ProgressSpinner } from "primereact/progressspinner";
import { ToastContainer } from "react-toastify";


const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const getProducts = async () => {
        setProcessing(true)
        try {
            const res = await fetch(prodUrl+"products");
            const data = await res.json();

            if (data.code === 200) {
                setProcessing(false);
                const sorted = [...data.data].sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );

                const categories = ["Stickers", "Tables Book", "Pencils"];
                const filteredProducts = categories.map(cat =>
                    sorted.find(p => p.pCategory === cat)
                ).filter(Boolean);
                setProducts(filteredProducts);

            } else if (data.code === 404) {
                console.error("No Products Found");
                setProducts([]);
                setProcessing(false);
            }
        } catch (err) {
            console.error("API Error:", err);
            setProcessing(false);
        } finally {
            setProcessing(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    const navigateToProductDetail = (id) => {
        navigate(`/product-details/${id}`);
    }


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
                <div className="row">
                    <div className="col-xxl-12">
                        {/* slider */}
                        <section className="mn-hero m-b-15 swiper-container">
                            <Slider />
                        </section>

                        <section className="home-c">
                            <div className="home-caption-container">
                                <h3 className="h3-heading">
                                    Welcome to We Love You!
                                </h3>
                                <div className="long-content">
                                    Because kids deserve love, love, and more love! At We Love You, we are overflowing with love to bring you the most lovable products and services, crafted with pure love and endless loving care for children. Whether it’s love-filled essentials, love-wrapped toys, or experiences made with love, we make sure every product spread love, radiates love, and fills young hearts with love.
                                </div>
                                <div className="btm-caption">
                                    Because love is the greatest gift we can give to every child, every day!
                                </div>
                            </div>
                        </section>

                        {/* products category */}
                        <section className=" p-tb-15">
                            <div className="">


                                {products.map((product, index) => {

                                    const isReversed = index % 2 === 1;

                                    return (
                                        <section
                                            key={product.productId}
                                            className={`product-section ${isReversed ? "reverse" : ""}`}
                                        >
                                            <div className="img-container">
                                                <img
                                                    src={product.productUrl}
                                                    alt={product.productName}
                                                    className="p-img"
                                                    onClick={()=>navigateToProductDetail(product.productId)}
                                                />
                                            </div>


                                            <div className="">
                                                <img
                                                    src={product.productUrl}
                                                    alt={product.productName}
                                                    className="mobile-view"
                                                    onClick={()=>navigateToProductDetail(product.productId)}
                                                />
                                            </div>



                                            <div className={`product-content ${isReversed ? "right" : ""}`}>
                                                <p className="top-line">{product.productTopTitle}</p>
                                                <h2 className="title">{product.productName}</h2>
                                                <p className="description-text">
                                                    {product.productdescription}
                                                </p>
                                                <div className="banner-btn">
                                                    <Link
                                                        to={`/product-details/${product.productId}`}
                                                        className="shop-now-btn"
                                                    >
                                                        <span>Shop Now</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </section>
                                    );
                                })}


                                {/* <div className="mn-modern-banner">
                                        {products.map((p, i) => (
                                            <div
                                                className={`modern-banner mb-4 d-flex mn-banner-mobile-view ${i === 1 ? "justify-content-end" : "justify-content-start"
                                                    }`}
                                                key={i}
                                            >
                                                <div
                                                    className="mn-banner-img mt-5 mb-5"
                                                    loading="lazy"
                                                    style={{
                                                        background: `url(${  p.productCustomization.bannerImageUrl})`,
                                                        
                                                    }}
                                                    onClick={() => navigateToProductDetail(p.productId)}
                                                >
                                                  
                                                </div>

                                                <div className={`mn-banner-contact ${i == 1 ? "mn-banner-contact-left-style" : ""}`}>
                                                    <div className="inner-banner">
                                        
                                                        <h4>{p.productdescription}</h4>
                                                    </div>
                                                
                                                    <div className="banner-btn">
                                                        <Link
                                                            to={`/product-details/${p.productId}`}
                                                            className="mn-btn-1"
                                                        >
                                                            <span>Shop Now</span>
                                                        </Link>
                                                    </div>
                                                </div>


                                            </div>
                                        ))}
                                    </div> */}


                            </div>
                        </section>

                        <section className="mn-service p-tb-15">
                            <div className="row m-b-m-24">
                                <div
                                    className="mn-ser-content mn-ser-content-1 col-sm-6 col-xl-3 m-b-24"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                    data-aos-delay="200"
                                >
                                    <div className="mn-ser-box">
                                        <div className="mn-ser-inner">
                                            <div className="mn-service-image">

                                                <img src="/images/FREE SHIPPING.png" className="free-shipping" alt="shipping-logo" loading="lazy" />
                                            </div>
                                            <div className="mn-service-desc">
                                                <h3>Love Travels Free!</h3>
                                                <p>Free love-filled shipping on all orders.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="mn-ser-content mn-ser-content-2 col-sm-6 col-xl-3 m-b-24"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                    data-aos-delay="400"
                                >
                                    <div className="mn-ser-box">
                                        <div className="mn-ser-inner">
                                            <div className="mn-service-image">


                                                <img src="/images/24-7 SUPPORT.png" alt="support-logo" loading="lazy" className="support-logo" />
                                            </div>
                                            <div className="mn-service-desc">
                                                <h3>24x7 Love Support!</h3>
                                                <p>
                                                    To surround you with endless love and loving care!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="mn-ser-content mn-ser-content-3 col-sm-6 col-xl-3 m-b-24"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                    data-aos-delay="600"
                                >
                                    <div className="mn-ser-box">
                                        <div className="mn-ser-inner">
                                            <div className="mn-service-image">



                                                <img src="/images/NO RETURN.png" alt="no-return" loading="lazy" />

                                            </div>
                                            <div className="mn-service-desc">
                                                <h3>Love Knows No Return (Policy)</h3>
                                                <p>Once love is shared, it stays forever with love!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="mn-ser-content mn-ser-content-4 col-sm-6 col-xl-3 m-b-24"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                    data-aos-delay="800"
                                >
                                    <div className="mn-ser-box">
                                        <div className="mn-ser-inner">
                                            <div className="mn-service-image">


                                                <img src="/images/PAYMENT SECURE.png" alt="payment-secure" loading="lazy" />
                                            </div>
                                            <div className="mn-service-desc">
                                                <h3>Love-Secure Payments!</h3>
                                                <p>
                                                    Safe, Protected, and Wrapped in Love!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <BottomSlider />
                    </div>
                </div>
            </div></>


    );
};

export default Products;

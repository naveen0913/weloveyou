import { useEffect, useState } from "react";
import Slider from "./Slider";
import { Link, useNavigate } from "react-router-dom";
import BottomSlider from "./BottomSlider";
import { isVideo, serverPort } from "./Constants";
import { ProgressSpinner } from "primereact/progressspinner";
import { ToastContainer } from "react-toastify";


const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const getProducts = async () => {
        setProcessing(true)
        try {
            const res = await fetch("http://localhost:8081/api/products");
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
            <div>
                {processing && (
                    <div className="overlay-screen">
                        <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="3" />
                    </div>
                )}
            </div>
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
                        <section className="mn-banner p-tb-15">
                            <div className="row">
                                <div
                                    className="col-12"
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                    data-aos-delay="200">

                                    {/* <div className="mn-modern-banner">
                                        {products.map((p, i) => (
                                            <div className="modern-banner mb-4" key={i}>

                                                <div
                                                    className="mn-banner-img"
                                                    loading="lazy"
                                                    style={{
                                                        background: `url(${p.productCustomization.bannerImageUrl})`,
                                                        
                                                    }}
                                                    onClick={() => navigateToProductDetail(p.productId)}
                                                >
                                                    {isVideo(p.productUrl) ? (
                                                        <video
                                                            src={p.productUrl}
                                                            className="w-100 h-100"
                                                            style={{
                                                                
                                                            }}
                                                            controls
                                                            muted
                                                            loop />
                                                    ) : (
                                                        <div
                                                            className="w-100 h-100"
                                                            style={{
                                                                background: `url(${p.productCustomization.bannerImageUrl})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                                borderRadius: "15px",
                                                            }} />
                                                    )}

                                                </div>
                                                <div className="mn-banner-contact">
                                                    <div className="inner-banner">
                                                        <h3>{p.productName}</h3>
                                                        <h4>{p.productdescription}</h4>
                                                    </div>
                                                    <div className="inner-text">
                                                        <span className="bnr-text">{p.pCategory}</span>
                                                       
                                                    </div>
                                                    <div className="banner-btn">
                                                        <Link to={`/product-details/${p.productId}`} className="mn-btn-1">
                                                            <span>Shop Now</span>
                                                        </Link>

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div> */}

                                    <div className="mn-modern-banner">
                                        {products.map((p, i) => (
                                            <div
                                                className={`modern-banner mb-4 d-flex mn-banner-mobile-view ${i === 1 ? "justify-content-end" : "justify-content-start"
                                                    }`}
                                                key={i}
                                            >
                                                <div
                                                    className="mn-banner-img"
                                                    loading="lazy"
                                                    style={{
                                                        background: `url(${serverPort + p.productCustomization.bannerImageUrl})`,
                                                    }}
                                                    onClick={() => navigateToProductDetail(p.productId)}
                                                >
                                                    {isVideo(p.productUrl) ? (
                                                        <video
                                                            src={p.productUrl}
                                                            className="w-100 h-100"
                                                            controls
                                                            muted
                                                            loop
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-100 h-100"
                                                            style={{
                                                                // background: `url(${serverPort + p.productCustomization.bannerImageUrl} )`,
                                                                background: `url(${encodeURI(serverPort + p.productCustomization.bannerImageUrl)})`,
                                                                backgroundPosition: "center",
                                                                backgroundSize: "cover",
                                                                borderRadius: "15px",
                                                            }}
                                                        />
                                                    )}
                                                </div>

                                                <div className={`mn-banner-contact ${i == 1 ? "mn-banner-contact-left-style" : ""}`}>
                                                    <div className="inner-banner">
                                                        <h3>{p.productName}</h3>
                                                        <h4>{p.productdescription}</h4>
                                                    </div>
                                                    <div className="inner-text">
                                                        <span className="bnr-text">{p.pCategory}</span>
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
                                    </div>
                                </div>
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
                                                {/* <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    version="1.1"
                                                    width="512"
                                                    height="512"
                                                    x="0"
                                                    y="0"
                                                    viewBox="0 0 512 512"
                                                    xmlSpace="preserve"
                                                    className=""
                                                >
                                                    <g>
                                                        <path
                                                            d="m476.158 286.938-13.259-53.035c3.625-.77 6.345-3.986 6.345-7.839v-8.551c0-18.566-15.105-33.67-33.67-33.67h-60.392v-17.637c0-9.136-7.432-16.568-16.568-16.568H246.32l68.24-27.296a8.017 8.017 0 0 0-5.955-14.887l-55.874 22.349c17.026-10.924 33.871-22.947 40.284-31.355 12.485-16.369 9.323-39.843-7.046-52.328-16.369-12.486-39.843-9.323-52.328 7.046-9.122 11.962-21.158 45.573-28.948 69.258-7.79-23.683-19.826-57.296-28.948-69.258-12.484-16.369-35.959-19.53-52.328-7.046-16.369 12.484-19.53 35.958-7.046 52.328 6.413 8.409 23.257 20.431 40.284 31.355l-55.874-22.349a8.014 8.014 0 0 0-10.421 4.466 8.016 8.016 0 0 0 4.466 10.421l68.24 27.296H50.772c-9.136 0-16.568 7.432-16.568 16.568v145.37a8.017 8.017 0 0 0 16.034 0v-145.37c0-.295.239-.534.534-.534h307.841c.295 0 .534.239.534.534v145.372a8.017 8.017 0 0 0 16.034 0v-9.088h94.566l.025.002.026-.001c11.636.009 21.516 7.647 24.908 18.171h-24.928a8.017 8.017 0 0 0-8.017 8.017v17.102c0 13.851 11.268 25.119 25.119 25.119h9.086v35.273h-20.962c-6.886-19.882-25.787-34.205-47.982-34.205s-41.097 14.322-47.982 34.205h-3.86V345.78a8.017 8.017 0 0 0-16.034 0v60.392H192.817c-6.886-19.882-25.787-34.205-47.982-34.205s-41.097 14.322-47.982 34.205H50.772a.534.534 0 0 1-.534-.534v-17.637h34.739a8.017 8.017 0 0 0 0-16.034H8.017a8.017 8.017 0 0 0 0 16.034h26.188v17.637c0 9.136 7.432 16.568 16.568 16.568h43.304c-.002.178-.014.355-.014.534 0 27.995 22.777 50.772 50.772 50.772s50.772-22.777 50.772-50.772c0-.18-.012-.356-.014-.534h180.67c-.002.178-.014.355-.014.534 0 27.995 22.777 50.772 50.772 50.772 27.995 0 50.772-22.777 50.772-50.772 0-.18-.012-.356-.014-.534h26.203a8.017 8.017 0 0 0 8.017-8.017v-85.511c.001-21.114-15.576-38.656-35.841-41.74zM172.9 121.059c-31.623-19.651-41.003-28.692-43.78-32.334-7.123-9.339-5.319-22.732 4.021-29.855a21.193 21.193 0 0 1 12.893-4.355c6.422 0 12.776 2.886 16.963 8.376 7.755 10.168 19.9 44.391 27.918 69.052a882.38 882.38 0 0 1-18.015-10.884zm45.573 10.883c8.018-24.66 20.163-58.882 27.917-69.052 7.123-9.339 20.516-11.142 29.855-4.02 9.34 7.123 11.143 20.516 4.021 29.855-2.777 3.641-12.157 12.683-43.778 32.333a881.445 881.445 0 0 1-18.015 10.884zm156.709 67.933h60.392c9.725 0 17.637 7.912 17.637 17.637v.534h-78.029v-18.171zm0 86.581V234.08h71.235l13.094 52.376h-84.329zM144.835 457.479c-19.155 0-34.739-15.584-34.739-34.739s15.584-34.739 34.739-34.739c19.155 0 34.739 15.584 34.739 34.739s-15.584 34.739-34.739 34.739zm282.188 0c-19.155 0-34.739-15.584-34.739-34.739s15.584-34.739 34.739-34.739c19.155 0 34.739 15.584 34.739 34.739s-15.584 34.739-34.739 34.739zm68.944-102.614h-9.086c-5.01 0-9.086-4.076-9.086-9.086v-9.086h18.171v18.172z"
                                                            fill="#000000"
                                                            opacity="1"
                                                            data-original="#000000"
                                                        ></path>
                                                        <path
                                                            d="M144.835 406.172c-9.136 0-16.568 7.432-16.568 16.568s7.432 16.568 16.568 16.568c9.136 0 16.568-7.432 16.568-16.568s-7.432-16.568-16.568-16.568zM427.023 406.172c-9.136 0-16.568 7.432-16.568 16.568s7.432 16.568 16.568 16.568c9.136 0 16.568-7.432 16.568-16.568s-7.432-16.568-16.568-16.568zM332.96 371.967H213.244a8.017 8.017 0 0 0 0 16.034H332.96a8.017 8.017 0 0 0 0-16.034zM127.733 337.763H25.119a8.017 8.017 0 0 0 0 16.034h102.614a8.017 8.017 0 0 0 0-16.034zM127.733 218.046H93.528a8.017 8.017 0 0 0-8.017 8.017v68.409a8.017 8.017 0 0 0 16.034 0v-26.188h17.637a8.017 8.017 0 0 0 0-16.034h-17.637v-18.17h26.188a8.017 8.017 0 0 0 0-16.034zM190.822 272.043c8.023-5.255 13.337-14.317 13.337-24.602 0-16.209-13.186-29.395-29.395-29.395h-21.378a8.017 8.017 0 0 0-8.017 8.017v68.409a8.017 8.017 0 0 0 16.034 0v-17.637h13.346l14.722 22.083a8.008 8.008 0 0 0 6.677 3.571 7.968 7.968 0 0 0 4.439-1.348 8.013 8.013 0 0 0 2.223-11.116l-11.988-17.982zm-16.058-11.241h-13.361V234.08h13.361c7.368 0 13.361 5.993 13.361 13.361s-5.993 13.361-13.361 13.361zM256 286.456h-26.188v-18.198c.177.012.354.027.534.027h17.102a8.017 8.017 0 0 0 0-16.034h-17.102c-.181 0-.357.015-.534.027V234.08H256a8.017 8.017 0 0 0 0-16.034h-34.205a8.017 8.017 0 0 0-8.017 8.017v68.409a8.017 8.017 0 0 0 8.017 8.017H256a8.017 8.017 0 0 0 0-16.033zM315.858 286.456H289.67v-18.171h9.086a8.017 8.017 0 0 0 0-16.034h-9.086V234.08h26.188a8.017 8.017 0 0 0 0-16.034h-34.205a8.017 8.017 0 0 0-8.017 8.017v68.409a8.017 8.017 0 0 0 8.017 8.017h34.205a8.017 8.017 0 0 0 0-16.033z"
                                                            fill="#000000"
                                                            opacity="1"
                                                            data-original="#000000"
                                                        ></path>
                                                    </g>
                                                </svg> */}
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

                                                {/* <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    version="1.1"
                                                    width="512"
                                                    height="512"
                                                    x="0"
                                                    y="0"
                                                    viewBox="0 0 512 511"
                                                    xmlSpace="preserve"
                                                    className=""
                                                >
                                                    <g>
                                                        <path
                                                            d="M506.813 111.23 307.405 1.734a10.005 10.005 0 0 0-9.625 0l-75.16 41.27a10.029 10.029 0 0 0-4.293 2.36L98.378 111.23a9.994 9.994 0 0 0-5.187 8.766v132.43c-20.234 6.328-38.777 17.488-54.195 32.91C-1.19 325.52-11.438 386.809 13.5 437.844c2.422 4.96 8.41 7.02 13.371 4.594 4.965-2.426 7.02-8.415 4.598-13.375-21.188-43.364-12.48-95.438 21.668-129.586 21.355-21.356 49.746-33.118 79.945-33.118s58.59 11.762 79.945 33.118c21.352 21.351 33.114 49.742 33.114 79.941s-11.762 58.59-33.118 79.945c-34.148 34.149-86.222 42.856-129.585 21.668-4.961-2.426-10.95-.367-13.372 4.594-2.425 4.965-.37 10.953 4.594 13.375a132.667 132.667 0 0 0 58.336 13.5c34.543-.004 68.625-13.45 94.172-38.996 11.715-11.715 20.973-25.23 27.523-39.922l43.09 23.66c1.5.824 3.156 1.235 4.813 1.235s3.316-.41 4.812-1.235L506.812 347.75a10.003 10.003 0 0 0 5.188-8.766v-69.496c0-5.523-4.477-10-10-10s-10 4.477-10 10v63.578l-179.375 98.497V235.39l59.2-32.508v51.531a9.996 9.996 0 0 0 10 10c1.655 0 3.316-.41 4.82-1.238l42.73-23.52a9.992 9.992 0 0 0 5.176-8.758v-62.46L492 136.895v52.597c0 5.524 4.477 10 10 10s10-4.476 10-10v-69.496a9.998 9.998 0 0 0-5.188-8.766zm-204.22-89.324 178.63 98.09-56.348 30.942-178.629-98.09zm0 196.176-178.628-98.086 58.414-32.078 178.633 98.086zm79.192-43.484L203.156 76.512l22.313-12.254 178.633 98.086zM227.168 285.336c-25.133-25.133-58.547-38.973-94.086-38.973-6.723 0-13.363.496-19.89 1.469V136.895l179.437 98.53v196.173l-31.145-17.102c3.067-11.289 4.653-23.062 4.653-35.078 0-35.54-13.84-68.953-38.969-94.082zm187.387-60.348-22.73 12.512v-45.598l22.73-12.48zm0 0"
                                                            fill="#000000"
                                                            opacity="1"
                                                            data-original="#000000"
                                                        ></path>
                                                        <path
                                                            d="M502 219.441a10.08 10.08 0 0 0-7.07 2.93 10.073 10.073 0 0 0-2.93 7.07 10.07 10.07 0 0 0 2.93 7.067c1.86 1.863 4.441 2.93 7.07 2.93s5.21-1.067 7.07-2.93a10.07 10.07 0 0 0 2.93-7.067c0-2.632-1.07-5.21-2.93-7.07a10.08 10.08 0 0 0-7.07-2.93zM99.457 389.418a9.973 9.973 0 0 0 7.07-2.926c3.907-3.906 3.907-10.238 0-14.144l-6.925-6.93h59.101c14.336 0 26 11.664 26 26s-11.664 26-26 26h-35.02c-5.523 0-10 4.477-10 10 0 5.52 4.477 9.996 10 9.996h35.02c25.363 0 46-20.633 46-45.996s-20.637-45.996-46-45.996H99.602l6.925-6.93c3.907-3.906 3.907-10.238 0-14.144-3.902-3.903-10.234-3.903-14.14 0l-24 24c-3.903 3.906-3.903 10.238 0 14.144l24 23.996a9.968 9.968 0 0 0 7.07 2.93zM46.074 476.45a9.953 9.953 0 0 1-7.64-3.56l-.02-.023c-3.555-4.226-3.008-10.531 1.219-14.086 4.226-3.558 10.535-3.011 14.09 1.215 3.55 4.23 3.015 10.547-1.211 14.102a9.979 9.979 0 0 1-6.438 2.351zm0 0"
                                                            fill="#000000"
                                                            opacity="1"
                                                            data-original="#000000"
                                                        ></path>
                                                    </g>
                                               
                                                </svg> */}

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

                                                {/* <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    version="1.1"
                                                    width="512"
                                                    height="512"
                                                    x="0"
                                                    y="0"
                                                    viewBox="0 0 511 512"
                                                    xmlSpace="preserve"
                                                >
                                                    <g>
                                                        <path
                                                            d="M235.793 347.266a10.013 10.013 0 0 0 0-14.149c-3.906-3.898-10.234-3.898-14.145 0-3.898 3.91-3.898 10.238 0 14.149 3.91 3.898 10.239 3.898 14.145 0zM188.45 109.969c0 60.636 49.331 109.972 109.968 109.972s109.969-49.336 109.969-109.972S359.055 0 298.418 0 188.449 49.332 188.449 109.969zm199.945 0c0 49.613-40.364 89.976-89.977 89.976s-89.977-40.363-89.977-89.976c0-49.61 40.364-89.973 89.977-89.973s89.977 40.363 89.977 89.973zm0 0"
                                                            fill="#000000"
                                                            opacity="1"
                                                            data-original="#000000"
                                                        ></path>
                                                        <path
                                                            d="M115.652 509.043c3.875 3.906 10.184 3.95 14.11.082l48.468-47.75c8.235-8.234 10.739-20.426 7.118-31.023l10.425-10.055a29.814 29.814 0 0 1 20.817-8.41h132.902c23.578 0 45.863-9.055 62.758-25.496.695-.676-5.277 6.359 90.668-108.313 14.23-16.836 12.102-42.117-4.75-56.363-16.746-14.113-41.832-12.086-56.102 4.46l-58.992 60.634c-7.449-9.168-18.808-14.883-31.082-14.883h-111.48c-15.864-6.637-32.696-9.996-50.063-9.996-48.14 0-90.176 22.234-112.734 63.922-9.504-1.801-19.528 1.074-26.738 8.285L3.418 381.836c-3.883 3.894-3.89 10.195-.016 14.102zm74.793-227.121c15.313 0 30.118 3.082 44.012 9.16a9.979 9.979 0 0 0 4.008.84h113.527c10.84 0 19.996 8.84 19.996 19.992 0 11.027-8.968 19.996-19.996 19.996h-81.566c-5.52 0-9.996 4.477-9.996 9.996 0 5.524 4.476 9.996 9.996 9.996h81.566c22.051 0 39.988-17.937 39.988-39.988 0-1.758-.125-3.5-.351-5.227 57.066-58.66 65.113-66.902 65.457-67.312 7.125-8.41 19.773-9.477 28.187-2.383 8.422 7.121 9.489 19.762 2.344 28.219L397.95 372.406c-13.094 12.57-30.285 19.489-48.457 19.489H216.59c-13.024 0-25.352 4.98-34.703 14.015l-8.496 8.2-78.32-78.317c18.304-34.34 52.652-53.871 95.374-53.871zm-125.32 66.344c3.297-3.297 8.36-3.891 12.379-1.407 1.73 1.055-3.238-3.468 86.59 86.235 3.996 3.996 3.781 10.363.054 14.09l-41.32 40.707-98.23-98.98zM286.422 49.988v11.715c-11.637 4.125-19.996 15.238-19.996 28.274 0 16.535 13.453 29.992 29.992 29.992 5.512 0 9.996 4.484 9.996 9.996 0 5.512-4.484 9.996-9.996 9.996-4.27 0-8.883-2.684-12.98-7.563-3.555-4.226-9.86-4.77-14.086-1.218-4.227 3.554-4.774 9.86-1.22 14.086 5.345 6.355 11.63 10.785 18.29 13.02v11.667c0 5.524 4.476 9.996 9.996 9.996s9.996-4.472 9.996-9.996v-11.715c11.637-4.129 19.996-15.242 19.996-28.273 0-16.54-13.453-29.992-29.992-29.992-5.512 0-9.996-4.485-9.996-9.996 0-5.512 4.484-10 9.996-10 3.543 0 7.281 1.808 10.812 5.226 3.97 3.84 10.297 3.734 14.137-.23 3.84-3.97 3.735-10.297-.23-14.137-5.075-4.91-10.153-7.688-14.723-9.203V49.988c0-5.523-4.477-10-9.996-10s-9.996 4.477-9.996 10zm0 0"
                                                            fill="#000000"
                                                            opacity="1"
                                                            data-original="#000000"
                                                        ></path>
                                                    </g>
                                                </svg> */}

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

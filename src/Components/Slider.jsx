import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OwlCarousel from "./OwlCarousel";

const Slider = () => {
    const slides = [
        {
            id: 1,
            discount: "50%",
            title: "Fashion sale <br>for Women's",
            desc: "Elevate your every day. Style that speaks volumes.",
            image: "/src/assets/img/hero/1.jpg",
        },
        {
            id: 2,
            discount: "35%",
            title: "Fashion sale <br>for Men's",
            desc: "Wear the change. Fashion that feels good.",
            image: "/src/assets/img/hero/1.jpg",
        },
        {
            id: 3,
            discount: "44%",
            title: "Fashion sale <br>for Children's",
            desc: "Wear the change. Fashion that feels good.",
            image: "/src/assets/img/hero/1.jpg",
        },
        {
            id: 4,
            discount: "22%",
            title: "Cosmetics sale <br>for Women's",
            desc: "Glow with confidence. Discover your beauty essentials.",
            image: "/src/assets/img/hero/1.jpg",
        },
        {
          id: 5,
          discount: "40%",
          title: "Cosmetics sale <br>for Women's",
          desc: "Glow with confidence. Discover your beauty essentials.",
          image: "/src/assets/img/hero/1.jpg",
      },
    ];

    return (
        <>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    className="mn-hero-slider owl-carousel"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div
                                className="mn-hero-slide"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "20px"
                                }}
                            >
                                <div className="mn-hero-slide swiper-slide">
                                    <div className="mn-hero-detail">
                                        <p className="label">
                                            <span>
                                                {slide.discount}
                                                <br />
                                                Off
                                            </span>
                                        </p>
                                        <h2 dangerouslySetInnerHTML={{ __html: slide.title }} />
                                        <p>{slide.desc}</p>
                                        <a href="/shop" className="mn-btn-2">
                                            <span>Shop Now</span>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* <OwlCarousel/> */}

            {/* testimonials */}
            {/* <section className="mn-testimonials p-tb-15">
                <div className="row">
                    <div className="col-md-12">
                        <div className="testim-bg">
                            <div className="section-title d-none">
                                <h2>Customers <span>Review</span></h2>
                            </div>
                            <div className="mn-test-outer mn-testimonials">
                                <ul className="mn-testimonial-slider owl-carousel">
                                    <li className="mn-test-item">
                                        <img
                                            src="/src/assets/img/icons/top-quotes.svg"
                                            className="svg_img test_svg top"
                                            alt="user" />
                                        <div className="mn-test-inner">
                                            <div className="mn-test-img">
                                                <img
                                                    alt="testimonial"
                                                    title="testimonial"
                                                    src="/src/assets/img/user/1.jpg" />
                                            </div>
                                            <div className="mn-test-content">
                                                <div className="mn-test-desc">
                                                    Lorem Ipsum is simply dummy text of the printing
                                                    and industry. Lorem Ipsum has been the
                                                    industry's standard dummy text ever since the
                                                    1500s.
                                                </div>
                                                <div className="mn-test-name">Mariya Klinton</div>
                                                <div className="mn-test-designation">(CEO)</div>
                                            </div>
                                        </div>
                                        <img
                                            src="/src/assets/img/icons/bottom-quotes.svg"
                                            className="svg_img test_svg bottom"
                                            alt="" />
                                    </li>
                                    <li className="mn-test-item">
                                        <img
                                            src="/src/assets/img/icons/top-quotes.svg"
                                            className="svg_img test_svg top"
                                            alt="" />
                                        <div className="mn-test-inner">
                                            <div className="mn-test-img">
                                                <img
                                                    alt="testimonial"
                                                    title="testimonial"
                                                    src="/src/assets/img/user/2.jpg" />
                                            </div>
                                            <div className="mn-test-content">
                                                <div className="mn-test-desc">
                                                    Standard dummy text ever since the 1500s, when
                                                    an unknown printer took a galley of type and
                                                    this is the lorem and scrambled it to make a
                                                    type specimen.
                                                </div>
                                                <div className="mn-test-name">John Doe</div>
                                                <div className="mn-test-designation">(CFO)</div>
                                            </div>
                                        </div>
                                        <img
                                            src="/src/assets/img/icons/bottom-quotes.svg"
                                            className="svg_img test_svg bottom"
                                            alt="" />
                                    </li>
                                    <li className="mn-test-item">
                                        <img
                                            src="/src/assets/img/icons/top-quotes.svg"
                                            className="svg_img test_svg top"
                                            alt="" />
                                        <div className="mn-test-inner">
                                            <div className="mn-test-img">
                                                <img
                                                    alt="testimonial"
                                                    title="testimonial"
                                                    src="/src/assets/img/user/3.jpg" />
                                            </div>
                                            <div className="mn-test-content">
                                                <div className="mn-test-desc">
                                                    When an unknown printer took a galley of type
                                                    and scrambled it to make a type specimen Lorem
                                                    Ipsum has been the industry's and ever since to
                                                    the 1500s,
                                                </div>
                                                <div className="mn-test-name">Nency Lykra</div>
                                                <div className="mn-test-designation">(Manager)</div>
                                            </div>
                                        </div>
                                        <img
                                            src="/src/assets/img/icons/bottom-quotes.svg"
                                            className="svg_img test_svg bottom"
                                            alt="" />
                                    </li>
                                </ul>
                            </div>
                            <span className="mn-testi-shape-2"></span>
                        </div>
                    </div>
                </div>
            </section> */}

        </>

    );
};

export default Slider;

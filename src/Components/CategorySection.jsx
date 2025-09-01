
import React from "react";
import OwlCarousel from "react-owl-carousel";


const categories = [
  {
    id: 1,
    discount: "35%",
    title: "Fashion",
    subtitle: "Clothes",
    items: 16,
    images: ["/src/assets/img/category/1.jpg", "/src/assets/img/category/2.jpg", "/src/assets/img/category/3.jpg"]
  },
  {
    id: 2,
    discount: "22%",
    title: "Generic",
    subtitle: "Cosmetics",
    items: 45,
    images: ["/src/assets/img/category/4.jpg", "/src/assets/img/category/5.jpg", "/src/assets/img/category/6.jpg"]
  },
  {
    id: 3,
    discount: "65%",
    title: "Stylish",
    subtitle: "Shoes",
    items: 58,
    images: ["/src/assets/img/category/7.jpg", "/src/assets/img/category/8.jpg", "/src/assets/img/category/9.jpg"]
  },
  {
    id: 4,
    discount: "45%",
    title: "Digital",
    subtitle: "Watches",
    items: 64,
    images: ["/src/assets/img/category/10.jpg", "/src/assets/img/category/11.jpg", "/src/assets/img/category/12.jpg"]
  },
  {
    id: 5,
    discount: "63%",
    title: "Leather",
    subtitle: "Belts",
    items: 75,
    images: ["/src/assets/img/category/13.jpg", "/src/assets/img/category/14.jpg", "/src/assets/img/category/15.jpg"]
  },
  {
    id: 6,
    discount: "23%",
    title: "Cotton",
    subtitle: "Bags",
    items: 15,
    images: ["/src/assets/img/category/16.jpg", "/src/assets/img/category/17.jpg", "/src/assets/img/category/18.jpg"]
  },
];

const options = {
  loop: true,
  margin: 10,
  nav: true,
  dots: false,
  autoplay: true,
  autoplayTimeout: 2000,
  responsive: {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 4 }
  }
};

export default function CategorySection() {

  return (


    // <section class="mn-category p-tb-15">
    //   <OwlCarousel className='owl-theme' {...options}>
    //   <div className="mn-cat owl-carousel">
    //     <div className="mn-cat-card cat-card-1">
    //       <img src="https://via.placeholder.com/200" alt="Item 1" />
    //     </div>
    //     <div className="mn-cat-card cat-card-2">
    //       <img src="https://via.placeholder.com/200" alt="Item 2" />
    //     </div>
    //     <div className="mn-cat-card cat-card-3">
    //       <img src="https://via.placeholder.com/200" alt="Item 3" />
    //     </div>
    //     <div className="mn-cat-card cat-card-4">
    //       <img src="https://via.placeholder.com/200" alt="Item 4" />
    //     </div>
    //     <div className="mn-cat-card cat-card-5">
    //       <img src="https://via.placeholder.com/200" alt="Item 5" />
    //     </div>
    //     <div className="mn-cat-card cat-card-6">
    //       <img src="https://via.placeholder.com/200" alt="Item 5" />
    //     </div>
    //     <div className="mn-cat-card cat-card-7">
    //       <img src="https://via.placeholder.com/200" alt="Item 5" />
    //     </div>
    //   </div>
    //   </OwlCarousel>
     

    // </section>

    <OwlCarousel className="owl-theme" {...options}>
    <div className="item"><h4>1</h4></div>
    <div className="item"><h4>2</h4></div>
    <div className="item"><h4>3</h4></div>
    <div className="item"><h4>4</h4></div>
    <div className="item"><h4>5</h4></div>
  </OwlCarousel>


  );
}

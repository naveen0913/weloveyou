import React, { useRef, useState, useEffect } from 'react';
import './styles.css';

const OwlCarousel = () => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const products = [
    {
      id: 1,
      name: "Single Cock (Nadu Kodi)",
      currentPrice: "R$ 320/Piece",
      originalPrice: "R$ 430/Piece",
      image: "https://via.placeholder.com/300x200?text=Single+Cock"
    },
    {
      id: 2,
      name: "Raw Meat (From Farm)",
      currentPrice: "R$ 200/KG",
      originalPrice: "R$ 250/KG",
      image: "https://via.placeholder.com/300x200?text=Raw+Meat"
    },
    {
      id: 3,
      name: "Fresh Farm Eggs",
      currentPrice: "R$ 200/Tray",
      originalPrice: "R$ 250/Tray",
      image: "https://via.placeholder.com/300x200?text=Fresh+Eggs"
    },
    {
      id: 4,
      name: "Original Farm Egg (Single)",
      currentPrice: "R$ 6",
      originalPrice: "R$ 10",
      image: "https://via.placeholder.com/300x200?text=Farm+Egg"
    },
    {
      id: 5,
      name: "Organic Chicken",
      currentPrice: "R$ 350/Piece",
      originalPrice: "R$ 450/Piece",
      image: "https://via.placeholder.com/300x200?text=Organic+Chicken"
    },
    {
      id: 6,
      name: "Farm Fresh Milk",
      currentPrice: "R$ 15/L",
      originalPrice: "R$ 20/L",
      image: "https://via.placeholder.com/300x200?text=Fresh+Milk"
    }
  ];

  // Handle scroll events to show/hide arrows
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Handle mouse down event for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse move event for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle touch start event for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  // Handle touch move event for mobile
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Scroll to the left
  const scrollLeftHandler = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Scroll to the right
  const scrollRightHandler = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Update arrow visibility on resize
  useEffect(() => {
    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener('resize', handleResize);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="product-carousel-container">      
      <div className="carousel-wrapper">
       
        <div 
          ref={carouselRef}
          className="product-carousel"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
          onScroll={handleScroll}
        >
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <div className="price-container">
                  <span className="current-price">{product.currentPrice}</span>
                  <span className="original-price">{product.originalPrice}</span>
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      
      </div>
      
    </div>
  );
};

export default OwlCarousel;
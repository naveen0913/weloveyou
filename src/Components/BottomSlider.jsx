
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";


function BottomSlider() {
  const [isMouseIn, setIsMouseIn] = useState(false)
  const xOffsetRef = useRef(0)
  const slidesRef = useRef(null)
  const animationRef = useRef(null)

  // Movie stills data
  const movieStills = [
    {
      id: 1,
      href: "#",
      src: "/src/assets/img/instagram/1.jpg",
      alt: "image-1"
    },
    {
      id: 2,
      href: "#",
      src: "/src/assets/img/instagram/2.jpg",
      alt: "image-2"
    },
    {
      id: 3,
      href: "#",
      src: "/src/assets/img/instagram/3.jpg",
      alt: "image-3"
    },
    {
      id: 4,
      href: "#", src: "/src/assets/img/instagram/4.jpg",
      alt: "image-4"
    },
    {
      id: 5,
      href: "#", src: "/src/assets/img/instagram/5.jpg",
      alt: "image-5"
    },
    {
      id: 6,
      href: "#", src: "/src/assets/img/instagram/6.jpg",
      alt: "image-6"
    },
    {
      id: 7,
      href: "#", src: "/src/assets/img/instagram/7.jpg",
      alt: "image-7"
    }
  ]

  const allSlides = [...movieStills, ...movieStills]

  const translate = () => {
    const offsetIncrementor = isMouseIn ? 0.0 : 2;
    if (xOffsetRef.current >= 258 * 7) xOffsetRef.current = 0
    else xOffsetRef.current = xOffsetRef.current + offsetIncrementor

    if (slidesRef.current) {
      slidesRef.current.style.transform = "translateX(-" + xOffsetRef.current + "px)"
    }

    animationRef.current = requestAnimationFrame(translate)
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(translate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMouseIn])

  const handleMouseOver = () => {
    setIsMouseIn(true)
  }

  const handleMouseOut = () => {
    setIsMouseIn(false)
  }

  return (
    <div className="app">
      <div className="container">
        <div className="slid-er">
          <div
            className="slides"
            ref={slidesRef}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            {allSlides.map((slide) => (
              <div className="slide" key={`${slide.id}-${Math.random()}`}>
                <div className="slide-content">
                  <a href={slide.href} rel="noopener noreferrer">
                    <img src={slide.src} alt={slide.alt} loading="lazy" />
                    <div className="button-container">
                      <i className="pi pi-instagram" style={{ fontSize: "3rem" }} ></i>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomSlider;

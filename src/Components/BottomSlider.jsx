
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
      src: "images/btm-slider-1.jpeg",
      alt: "btm-image-1"
    },
    {
      id: 2,
      href: "#",
      src: "images/btm-slider-2.jpeg",
      alt: "btm-image-2"
    },
    {
      id: 3,
      href: "#",
      src: "images/btm-slider-3.jpeg",
      alt: "btm-image-3"
    },
    {
      id: 4,
      href: "#",
      src: "images/btm-slider-4.jpeg",
      alt: "btm-image-4"
    },
    {
      id: 5,
      href: "#",
      src: "images/btm-slider-5.jpeg",
      alt: "btm-image-5"
    }

  ]

  const allSlides = [...movieStills, ...movieStills, ...movieStills];
  const slideWidth = 258
  const totalSlides = allSlides.length
  const totalWidth = slideWidth * totalSlides


  const translate = () => {
    const offsetIncrementor = isMouseIn ? 0.0 : 0.4
    xOffsetRef.current = xOffsetRef.current + offsetIncrementor

    if (xOffsetRef.current >= slideWidth * movieStills.length) {
      xOffsetRef.current = 0
    }

    if (slidesRef.current) {
      slidesRef.current.style.transform = `translateX(-${xOffsetRef.current}px)`
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
      <div className="w-100">
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

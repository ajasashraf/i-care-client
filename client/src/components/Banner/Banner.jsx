import React from "react";
import "./Banner.css";
import { useState, useEffect } from "react";
function Banner() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [playing] = useState(true);

  const slides = [
    {
      title: "Patient-Centered Care",
      subtitle: "Put Your Health and Well-being First",
      image: "/Images/Banner1.jpg",
    },
    {
      title: "Innovative Treatments",
      subtitle: "Discover the Latest Advances in Technology",
      image: "/Images/Banner2.webp",
    },
    {
      title: "Quality Healthcare for Everyone",
      subtitle: "Experience Compassionate Care with Us",
      image: "/Images/Banner3.avif",
    },
  ];
  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setSlideIndex(slideIndex === slides.length - 1 ? 0 : slideIndex + 1);
      }, 5000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [slideIndex, playing, slides.length]);

  const goToPrevSlide = () => {
    setSlideIndex(slideIndex === 0 ? slides.length - 1 : slideIndex - 1);
  };

  const goToNextSlide = () => {
    setSlideIndex(slideIndex === slides.length - 1 ? 0 : slideIndex + 1);
  };

  return (
    
    <div
      className="hero "
      style={{ backgroundImage: `url(${slides[slideIndex].image})` }}
    >
      <div className="hero-text-container ">
        <h1 className="hero-title">{slides[slideIndex].title}</h1>
        <p className="hero-subtitle">{slides[slideIndex].subtitle}</p>
        <button
          className="hero-button prev-button bg-cyan-800"
          onClick={goToPrevSlide}
        >
          &#10094;
        </button>
        <button
          className="hero-button next-button bg-cyan-800"
          onClick={goToNextSlide}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Banner;

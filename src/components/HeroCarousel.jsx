import React from 'react';
import Slider from 'react-slick';
import './HeroCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  const slides = [
    {
      id: 1,
      image: './images/carrusel1.png',
      alt: 'Restaurante elegante'
    },
    {
      id: 2,
      image: './images/carrusel2.png',
      alt: 'Interior restaurante'
    },
    {
      id: 3,
      image: './images/carrusel3.png',
      alt: 'Comida gourmet'
    },
  ];

  return (
    <div className="hero-carousel">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-slide">
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
      </Slider>

      {/* Cuadro de texto sobrepuesto */}
      <div className="carousel-overlay-text">
        <span className="badge-nuevo">Nuevo</span>
        <h2>Inauguraciones más atractivas del país</h2>
        <p>Descubre las nuevas inauguraciones imprescindibles.</p>
      </div>
    </div>
  );
};

export default HeroCarousel;
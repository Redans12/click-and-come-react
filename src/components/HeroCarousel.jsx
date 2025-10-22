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
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      alt: 'Restaurante elegante'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
      alt: 'Interior restaurante'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
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
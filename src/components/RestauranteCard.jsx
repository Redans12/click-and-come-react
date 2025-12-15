import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import VistaDetalladaRestaurante from './VistaDetalladaRestaurante';
import './RestauranteCard.css';

const RestauranteCard = ({ restaurante }) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleCardClick = () => {
    setModalAbierto(true);
  };

  return (
    <>
      <div className="restaurante-card" onClick={handleCardClick}>
        {/* Imagen */}
        <div className="restaurante-card-image">
          <img
            src={restaurante.imagen_url || 'https://via.placeholder.com/300x200'}
            alt={restaurante.nombre}
            loading="lazy"
          />
          {restaurante.calificacion_promedio && (
            <div className="restaurante-card-rating">
              <Star className="star-icon" />
              <span>{restaurante.calificacion_promedio}</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="restaurante-card-content">
          <h3 className="restaurante-card-title">{restaurante.nombre}</h3>
          
          <div className="restaurante-card-info">
            <span className="restaurante-card-cuisine">{restaurante.tipo_comida}</span>
            {restaurante.rango_precio && (
              <>
                <span className="dot">•</span>
                <span className="restaurante-card-price">{restaurante.rango_precio}</span>
              </>
            )}
          </div>

          {restaurante.ciudad && (
            <div className="restaurante-card-location">
              <MapPin className="location-icon" />
              <span>{restaurante.ciudad}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de vista detallada */}
      <VistaDetalladaRestaurante
        restaurante={restaurante}
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </>
  );
};

export default RestauranteCard;
import React from 'react';
import { MapPin, Star, Utensils } from 'lucide-react';
import './SearchDropdown.css';

const SearchDropdown = ({ restaurantes, searchTerm, onSelect, onClose }) => {
  if (!searchTerm || restaurantes.length === 0) return null;

  return (
    <>
      {/* Overlay invisible para cerrar al hacer click fuera */}
      <div 
        className="search-dropdown-overlay" 
        onClick={onClose}
      />
      
      {/* Dropdown con resultados */}
      <div className="search-dropdown">
        <div className="search-dropdown-header">
          <span className="search-dropdown-count">
            {restaurantes.length} resultado{restaurantes.length !== 1 ? 's' : ''} encontrado{restaurantes.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="search-dropdown-results">
          {restaurantes.slice(0, 8).map((restaurante) => (
            <button
              key={restaurante.id_restaurante}
              className="search-dropdown-item"
              onClick={() => {
                onSelect(restaurante);
                onClose();
              }}
            >
              {/* Imagen */}
              <div className="search-dropdown-item-image">
                <img
                  src={restaurante.imagen_url || 'https://via.placeholder.com/80'}
                  alt={restaurante.nombre}
                />
              </div>
              
              {/* Información */}
              <div className="search-dropdown-item-info">
                <h4 className="search-dropdown-item-name">{restaurante.nombre}</h4>
                
                <div className="search-dropdown-item-details">
                  <div className="search-dropdown-item-detail">
                    <Utensils className="search-dropdown-icon" />
                    <span>{restaurante.tipo_comida}</span>
                  </div>
                  
                  <div className="search-dropdown-item-detail">
                    <MapPin className="search-dropdown-icon" />
                    <span>{restaurante.ciudad}</span>
                  </div>
                  
                  {restaurante.calificacion_promedio && (
                    <div className="search-dropdown-item-detail">
                      <Star className="search-dropdown-icon star" />
                      <span>{restaurante.calificacion_promedio}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Flecha */}
              <div className="search-dropdown-item-arrow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
        
        {restaurantes.length > 8 && (
          <div className="search-dropdown-footer">
            <span>Mostrando los primeros 8 resultados</span>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchDropdown;
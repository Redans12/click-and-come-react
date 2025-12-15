import React from 'react';
import RestauranteCard from './RestauranteCard';
import './ListaRestaurantes.css';

const ListaRestaurantes = ({ restaurantes = [] }) => {
  if (!restaurantes || restaurantes.length === 0) {
    return (
      <div className="lista-restaurantes-empty">
        <p>No hay restaurantes disponibles</p>
      </div>
    );
  }

  return (
    <div className="lista-restaurantes">
      {restaurantes.map((restaurante) => (
        <RestauranteCard 
          key={restaurante.id_restaurante} 
          restaurante={restaurante} 
        />
      ))}
    </div>
  );
};

export default ListaRestaurantes;
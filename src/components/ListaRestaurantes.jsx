import React from 'react';
import RestauranteCard from './RestauranteCard';

const ListaRestaurantes = ({ restaurantes = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
import React, { useState } from 'react';
import { Heart, MoreVertical } from 'lucide-react';
import HorariosDisponibles from './HorariosDisponibles';
import VistaDetalladaRestaurante from './VistaDetalladaRestaurante';


// Componente de Botón Like CREO QUE ESTE BOTON NO VA PERO SI ESTABA EN FIGMA
const BotonLike = ({ restaurante }) => {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
      aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
      />
    </button>
  );
};

// Componente de Botón Tres Puntos 
// ESTO SOLO ES UNA PRUEBA Y TIENE VALORES CONSTANTES, ES TODO UN COMPONENTE APARTE Y SOLO
// SE LLAMA AQUO (SE LLAMA COMO EL DE HORARIOS MAS ABAJO) REVISA EL DE LARAVEL PARA VER LA LLAMADA
const BotonTresPuntos = ({ restaurante, onVerDetalle }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleVerDetalle = () => {
    setShowMenu(false);
    if (onVerDetalle && typeof onVerDetalle === 'function') {
      onVerDetalle();
    }
  };

  return (
    <div className="absolute top-3 left-3">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Opciones"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      
      {showMenu && (
        <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg py-2 min-w-[150px] z-10">
          <button 
            onClick={handleVerDetalle}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Vista detallada
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Compartir
          </button>
        </div>
      )}
    </div>
  );
};

// Componente Principal de Tarjeta de Restaurante
const RestauranteCard = ({ restaurante }) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
        {/* Imagen de fondo */}
        <div 
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url('${restaurante.imagen_url}')` }}
        >
          <BotonTresPuntos 
            restaurante={restaurante} 
            onVerDetalle={() => setMostrarDetalle(true)}
          />
          <BotonLike restaurante={restaurante} />
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {restaurante.nombre}
          </h3>

          <div className="flex items-center mt-1 space-x-2 text-sm text-gray-600">
            <span>{restaurante.tipo_comida}</span>
            <span>·</span>
            <span>{restaurante.rango_precio}</span>
            <span>·</span>
            <span>{restaurante.ciudad}</span>
          </div>

          {/* Horarios fijos exactamente como en Laravel */}
          <HorariosDisponibles 
            horarios={['11:00 AM', '11:15 AM']} 
            color="blue" 
          />
        </div>
      </div>

      {/* Modal de Vista Detallada */}
      <VistaDetalladaRestaurante
        restaurante={restaurante}
        isOpen={mostrarDetalle}
        onClose={() => setMostrarDetalle(false)}
      />
    </>
  );
};

export default RestauranteCard;
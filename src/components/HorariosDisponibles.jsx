import React from 'react';

const HorariosDisponibles = ({ horarios = [], color = 'blue' }) => {
  // Mapeo de colores a clases de Tailwind
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white'
  };

  const selectedColorClass = colorClasses[color] || colorClasses.gray;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {horarios.map((hora, index) => (
        <button
          key={index}
          className={`px-4 py-2 text-xs font-bold rounded-md transition ${selectedColorClass}`}
          onClick={(e) => {
            e.preventDefault();
            // Aquí puedes agregar la lógica cuando se hace clic en un horario
            console.log('Horario seleccionado:', hora);
          }}
        >
          {hora}
        </button>
      ))}
    </div>
  );
};

export default HorariosDisponibles;
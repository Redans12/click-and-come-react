import React from "react";
import RestauranteCard from "./RestauranteCard";
import { ChevronRight } from "lucide-react";

const SeccionRestaurantes = ({
titulo,
icono,
restaurantes = [],
onVerTodo,
}) => {
return (
    <div className="py-8">
      {/* Header de la sección */}
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
        {icono && <span className="text-2xl">{icono}</span>}
        <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
        </div>

        {onVerTodo && (
        <button
            onClick={onVerTodo}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
            Ver Todo
            <ChevronRight className="w-4 h-4" />
        </button>
        )}
    </div>

      {/* Grid de restaurantes */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {restaurantes.map((restaurante) => (
        <RestauranteCard
            key={restaurante.id_restaurante}
            restaurante={restaurante}
        />
        ))}
    </div>
    </div>
);
};

export default SeccionRestaurantes;

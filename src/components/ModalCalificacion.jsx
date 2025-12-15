import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { supabase } from '../config/supabaseClient';

function ModalCalificacion({ isOpen, onClose, reservacion, usuario }) {
  const [calificacion, setCalificacion] = useState(0);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (calificacion === 0) {
      alert('Por favor selecciona una calificación de 1 a 5 estrellas');
      return;
    }

    try {
      setEnviando(true);

      // 1. Insertar la reseña
      const { data: resenaData, error: resenaError } = await supabase
        .from('resenas')
        .insert([
          {
            id_reservacion: reservacion.id_reservacion,
            id_restaurante: reservacion.id_restaurante,
            id_usuario: usuario.id_usuario,
            calificacion: calificacion,
            comentario: comentario.trim() || null,
          },
        ])
        .select();

      if (resenaError) {
        console.error('Error insertando reseña:', resenaError);
        throw resenaError;
      }

      // 2. Recalcular el promedio de calificación del restaurante
      const { data: resenasData, error: resenasError } = await supabase
        .from('resenas')
        .select('calificacion')
        .eq('id_restaurante', reservacion.id_restaurante);

      if (resenasError) {
        console.error('Error obteniendo reseñas:', resenasError);
        throw resenasError;
      }

      // Calcular el promedio
      const totalResenas = resenasData.length;
      const sumaCalificaciones = resenasData.reduce((sum, r) => sum + r.calificacion, 0);
      const nuevoPromedio = sumaCalificaciones / totalResenas;

      // 3. Actualizar el promedio en la tabla restaurantes
      const { error: updateError } = await supabase
        .from('restaurantes')
        .update({ calificacion_promedio: nuevoPromedio })
        .eq('id_restaurante', reservacion.id_restaurante);

      if (updateError) {
        console.error('Error actualizando promedio:', updateError);
        throw updateError;
      }

      alert('¡Gracias por tu calificación! Tu opinión es muy importante para nosotros.');
      onClose();
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error al enviar la calificación. Por favor intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Calificar Restaurante</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Información del Restaurante */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {reservacion.restaurantes.nombre}
            </h3>
            <p className="text-sm text-gray-600">
              {reservacion.restaurantes.tipo_comida} • {reservacion.restaurantes.ciudad}
            </p>
          </div>

          {/* Selección de Estrellas */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ¿Cómo calificas tu experiencia?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setCalificacion(star)}
                  onMouseEnter={() => setHoverCalificacion(star)}
                  onMouseLeave={() => setHoverCalificacion(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoverCalificacion || calificacion)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {calificacion > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {calificacion === 1 && 'Muy malo'}
                {calificacion === 2 && 'Malo'}
                {calificacion === 3 && 'Regular'}
                {calificacion === 4 && 'Bueno'}
                {calificacion === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comentario (Opcional) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {comentario.length}/500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || calificacion === 0}
              className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? 'Enviando...' : 'Enviar Calificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCalificacion;
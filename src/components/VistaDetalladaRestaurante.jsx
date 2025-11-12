import React, { useState } from 'react';
import { X, Share2, Heart, MapPin, ChevronDown, Bell } from 'lucide-react';

const VistaDetalladaRestaurante = ({ restaurante, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [guests, setGuests] = useState(2);
  const [timeFilter, setTimeFilter] = useState('All Day');
  const [dateFilter, setDateFilter] = useState('Today');
  const [isFavorite, setIsFavorite] = useState(false);
  const [notified, setNotified] = useState(false);

  if (!isOpen || !restaurante) return null;

  // Generar horarios disponibles
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 12; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const time = `${hour > 12 ? hour - 12 : hour}:${min.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Generar días del mes
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        day: date.getDate(),
        dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
        fullDate: date
      });
    }
    return days;
  };

  const timeSlots = generateTimeSlots();
  const calendarDays = generateCalendarDays();

  const handleShare = () => {
    alert(`Compartiendo ${restaurante.nombre}`);
  };

  const handleNotify = () => {
    setNotified(!notified);
    if (!notified) {
      alert('¡Te notificaremos cuando haya disponibilidad!');
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    console.log(`Horario seleccionado: ${time} para ${guests} personas`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurante.nombre}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="text-orange-500">★ {restaurante.calificacion_promedio || '5.0'}</span>
              <span>•</span>
              <span>{restaurante.tipo_comida}</span>
              <span>•</span>
              <span>{restaurante.rango_precio}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{restaurante.ciudad}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Compartir"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Booking Section */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <select 
                  value={guests}
                  onChange={(e) => {
                    setGuests(e.target.value);
                    console.log(`Número de invitados: ${e.target.value}`);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer hover:border-blue-400 transition"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Persona{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>

              <div className="relative">
                <select 
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    console.log(`Filtro de fecha: ${e.target.value}`);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer hover:border-blue-400 transition"
                >
                  <option>Hoy</option>
                  <option>Mañana</option>
                  <option>Esta Semana</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>

              <div className="relative">
                <select 
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value);
                    console.log(`Filtro de tiempo: ${e.target.value}`);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer hover:border-blue-400 transition"
                >
                  <option>Todo el día</option>
                  <option>Desayuno</option>
                  <option>Almuerzo</option>
                  <option>Cena</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Calendar Days */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDate(index);
                    setSelectedTime(null); // Reset time selection
                    console.log(`Fecha seleccionada: ${day.fullDate.toLocaleDateString()}`);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[60px] p-3 rounded-lg border transition ${
                    selectedDate === index
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-xs font-medium">{day.dayName}</span>
                  <span className="text-lg font-bold">{day.day}</span>
                </button>
              ))}
              <button 
                onClick={() => alert('Ver más fechas disponibles')}
                className="flex items-center justify-center min-w-[60px] p-3 rounded-lg border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <span className="text-2xl text-gray-400">→</span>
              </button>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 text-sm font-semibold rounded-lg transition ${
                    selectedTime === time
                      ? 'bg-blue-800 text-white ring-2 ring-blue-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Selection Summary */}
            {selectedTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 font-medium">
                  ✓ Seleccionado: {selectedTime} para {guests} persona{guests > 1 ? 's' : ''} el {calendarDays[selectedDate].dayName} {calendarDays[selectedDate].day}
                </p>
              </div>
            )}

            {/* Notify Buttons */}
            <div className="flex gap-2 mb-8">
              <button 
                onClick={handleNotify}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                  notified 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {notified ? 'Notificaciones activadas' : 'Notificarme'}
                </span>
              </button>
            </div>

            {/* About Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Sobre {restaurante.nombre}</h2>
              <p className="text-gray-600 mb-4">
                {restaurante.descripcion || 'Disfruta de una experiencia gastronómica única en nuestro restaurante.'}
              </p>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p>{restaurante.direccion || `Ubicado en ${restaurante.ciudad}, México`}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image and Map */}
          <div className="lg:col-span-1 space-y-4">
            {/* Restaurant Image */}
            <div className="rounded-lg overflow-hidden h-64">
              <img 
                src={restaurante.imagen_url || 'https://via.placeholder.com/400x300'} 
                alt={restaurante.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Map Placeholder */}
            <div className="rounded-lg overflow-hidden h-48 bg-gray-200 relative cursor-pointer hover:opacity-90 transition">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-red-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">{restaurante.nombre}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {restaurante.direccion || `${restaurante.ciudad}, Michoacán, México`}
              </p>
              <button 
                onClick={() => alert(`Abriendo mapa para ${restaurante.nombre}`)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
              >
                <MapPin className="w-4 h-4" />
                Obtener Direcciones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaDetalladaRestaurante;
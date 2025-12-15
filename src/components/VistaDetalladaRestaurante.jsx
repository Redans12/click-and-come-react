import React, { useState, useEffect, useCallback } from 'react';
import { X, Share2, Heart, MapPin, ChevronDown, Bell, Calendar as CalendarIcon, Clock, Users as UsersIcon } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import ModalReservacion from './modal-reservacion';

const VistaDetalladaRestaurante = ({ restaurante, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [guests, setGuests] = useState(2);
  const [timeFilter, setTimeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('Hoy'); 
  const [isFavorite, setIsFavorite] = useState(false);
  const [notified, setNotified] = useState(false);

  const mapQuery = restaurante.direccion 
    ? `${restaurante.direccion}, ${restaurante.ciudad || ''}`
    : restaurante.ciudad || 'México';
  const debeMostrarMapa = !!restaurante.direccion;

  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [reservaciones, setReservaciones] = useState([]);
  const [cargandoReservaciones, setCargandoReservaciones] = useState(false);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const cargarReservaciones = useCallback(async () => {
    if (!restaurante?.id_restaurante) return;
    try {
      setCargandoReservaciones(true);
      const { data, error } = await supabase
        .from('reservaciones')
        .select(`
          id_reservacion,
          fecha_hora,
          cantidad_personas,
          estado,
          notas,
          id_usuario,
          usuarios:id_usuario (
            nombre,
            email
          )
        `)
        .eq('id_restaurante', restaurante.id_restaurante)
        .order('fecha_hora', { ascending: false })
        .limit(50);

      if (error) throw error;

      const reservacionesProcesadas = data.map(res => {
        const fechaHora = new Date(res.fecha_hora);
        const ahora = new Date();
        const esDelUsuario = usuario && res.id_usuario === usuario.id_usuario;
        const esFutura = fechaHora > ahora;
        const esHoy = fechaHora.toDateString() === ahora.toDateString();

        return {
          id: res.id_reservacion,
          fecha_hora: fechaHora,
          cantidad_personas: res.cantidad_personas,
          estado: res.estado,
          notas: res.notas,
          usuario_nombre: res.usuarios?.nombre,
          es_del_usuario: esDelUsuario,
          es_futura: esFutura,
          es_hoy: esHoy
        };
      });

      setReservaciones(reservacionesProcesadas);
    } catch (error) {
      console.error('Error al cargar reservaciones:', error);
    } finally {
      setCargandoReservaciones(false);
    }
  }, [restaurante?.id_restaurante, usuario]); 

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        setCargandoUsuario(true);
        const userString = localStorage.getItem('user');
        if (userString) {
          const userData = JSON.parse(userString);
          setUsuario(userData);
          setCargandoUsuario(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setUsuario(null);
          return;
        }

        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, email, rol, telefono')
            .eq('email', session.user.email)
            .single();

          if (userError) {
            setUsuario(null);
          } else {
            setUsuario(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          setUsuario(null);
        }
      } catch (error) {
        setUsuario(null);
      } finally {
        setCargandoUsuario(false);
      }
    };

    obtenerUsuario();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUsuario(null);
        localStorage.removeItem('user');
      } else if (event === 'SIGNED_IN') {
        obtenerUsuario();
      }
    });

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        obtenerUsuario();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 

  useEffect(() => {
    if (restaurante?.id_restaurante && isOpen) {
      cargarReservaciones();
    }
  }, [restaurante?.id_restaurante, isOpen, cargarReservaciones]);

  useEffect(() => {
    if (isOpen) {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUsuario(userData);
      }
    }
  }, [isOpen]);

  if (!isOpen || !restaurante) return null;

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
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

  const calendarDays = generateCalendarDays();

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = timeFilter === 'lunch' ? 12 : timeFilter === 'dinner' ? 18 : 12;
    const endHour = timeFilter === 'lunch' ? 16 : timeFilter === 'dinner' ? 22 : 22;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour > 12 ? hour - 12 : hour}:${min.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        const fullDate = calendarDays[selectedDate]?.fullDate;
        if (!fullDate) continue;

        const dateForCheck = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate(), hour, min);

        const estaReservado = reservaciones.some(res => {
          const resDate = res.fecha_hora; 
          return resDate.getFullYear() === dateForCheck.getFullYear() &&
            resDate.getMonth() === dateForCheck.getMonth() &&
            resDate.getDate() === dateForCheck.getDate() &&
            resDate.getHours() === dateForCheck.getHours() &&
            resDate.getMinutes() === dateForCheck.getMinutes();
        });

        slots.push({
          time,
          disponible: !estaReservado,
          reservado: estaReservado
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const reservacionesMostradas = mostrarTodas ? reservaciones : reservaciones.slice(0, 3);

  const handleShare = () => {
    alert(`Compartiendo ${restaurante.nombre}`);
  };

  const handleNotify = () => {
    setNotified(!notified);
    if (!notified) {
      alert('¡Te notificaremos cuando haya disponibilidad!');
    }
  };

  const handleTimeSelect = (time, disponible) => {
    if (!disponible) {
      alert('Este horario ya está reservado');
      return;
    }
    setSelectedTime(time);
    setModalReservaAbierto(true);
  };

  const cancelarReservacion = async (idReservacion) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('¿Estás seguro de cancelar esta reservación?')) return;

    try {
      const { error } = await supabase
        .from('reservaciones')
        .update({ estado: 'cancelada' })
        .eq('id_reservacion', idReservacion);

      if (error) throw error;

      alert('Reservación cancelada exitosamente');
      cargarReservaciones();
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('Error al cancelar la reservación');
    }
  };

  return (
    <>
      {/* 🔥 RESPONSIVE: overflow-y-auto para scroll */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">
          {/* Header - 🔥 RESPONSIVE */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-6 flex justify-between items-start z-10">
            <div className="flex-1 pr-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{restaurante.nombre}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                <span className="text-orange-500">★ {restaurante.calificacion_promedio || '5.0'}</span>
                <span className="hidden sm:inline">•</span>
                <span>{restaurante.tipo_comida}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{restaurante.rango_precio}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{restaurante.ciudad}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition"
                title="Compartir"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition"
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition"
                title="Cerrar"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content - 🔥 RESPONSIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-6">
            {/* Left Column - Booking Section */}
            <div className="lg:col-span-2">
              {/* Filters - 🔥 RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full p-2 sm:p-3 text-sm border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer hover:border-blue-400 transition"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 bottom-2 sm:bottom-3 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-2">Date</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-2 sm:p-3 text-sm border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer hover:border-blue-400 transition"
                  >
                    <option>Hoy</option>
                    <option>Mañana</option>
                    <option>Esta Semana</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-2 sm:bottom-3 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-2">Time</label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full p-2 sm:p-3 text-sm border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer hover:border-blue-400 transition"
                  >
                    <option value="all">All Day</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-2 sm:bottom-3 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {/* Calendar Days - 🔥 RESPONSIVE SCROLL */}
              <div className="border-t pt-4 mb-6">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(index);
                        setSelectedTime(null);
                      }}
                      className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px] p-2 sm:p-3 rounded-lg border transition ${
                        selectedDate === index
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-xs font-medium">{day.dayName}</span>
                      <span className="text-base sm:text-lg font-bold">{day.day}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid - 🔥 RESPONSIVE */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {timeFilter === 'lunch' ? 'Lunch' : timeFilter === 'dinner' ? 'Dinner' : 'Horarios Disponibles'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(slot.time, slot.disponible)}
                      disabled={slot.reservado}
                      className={`p-2 sm:p-3 text-xs sm:text-sm font-semibold rounded-lg transition ${
                        slot.reservado
                          ? 'bg-red-600 text-white cursor-not-allowed'
                          : selectedTime === slot.time
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                      }`}
                    >
                      {slot.time}
                      <div className="text-xs opacity-90">
                        {slot.reservado ? 'Reservado' : 'Cubierta'}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleNotify}
                    className={`p-2 sm:p-3 border-2 rounded-lg transition ${
                      notified
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">
                      {notified ? 'Activado' : 'Notify'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Historial de Reservaciones */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                    {usuario ? 'Mis Reservaciones' : 'Reservaciones Recientes'}
                    {reservaciones.length > 0 && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                        {reservaciones.length}
                      </span>
                    )}
                  </h2>
                  {reservaciones.length > 3 && (
                    <button
                      onClick={() => setMostrarTodas(!mostrarTodas)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {mostrarTodas ? 'Ver menos' : `Ver todas (${reservaciones.length})`}
                    </button>
                  )}
                </div>

                {cargandoReservaciones ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Cargando reservaciones...</div>
                ) : reservaciones.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Aún no hay reservaciones en este restaurante
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reservacionesMostradas.map((reservacion) => (
                      <div
                        key={reservacion.id}
                        className={`border rounded-lg p-3 sm:p-4 hover:border-blue-300 transition ${
                          reservacion.es_del_usuario ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="flex-1 w-full">
                            {reservacion.es_del_usuario && (
                              <div className="mb-2">
                                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
                                  <UsersIcon className="w-3 h-3 mr-1" />
                                  Tu reservación
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 mb-2">
                              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                {reservacion.fecha_hora.toLocaleDateString('es-ES', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              {reservacion.es_hoy && (
                                <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                                  Hoy
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {reservacion.fecha_hora.toLocaleTimeString('es-ES', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                              <div className="flex items-center">
                                <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {reservacion.cantidad_personas} {reservacion.cantidad_personas > 1 ? 'personas' : 'persona'}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {reservacion.estado === 'confirmada' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Confirmada
                                </span>
                              )}
                              {reservacion.estado === 'pendiente' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  ⏱ Pendiente
                                </span>
                              )}
                              {reservacion.estado === 'cancelada' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  ❌ Cancelada
                                </span>
                              )}
                              {!reservacion.es_futura && reservacion.estado !== 'cancelada' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  ✓ Completada
                                </span>
                              )}
                            </div>
                            {reservacion.notas && (
                              <p className="text-xs text-gray-500 mt-2">
                                💬 {reservacion.notas}
                              </p>
                            )}
                          </div>
                          {reservacion.es_del_usuario && reservacion.es_futura && reservacion.estado === 'confirmada' && (
                            <button
                              onClick={() => cancelarReservacion(reservacion.id)}
                              className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition flex-shrink-0"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!usuario && reservaciones.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      💡 <a href="#" className="font-semibold underline">Inicia sesión</a> para ver y gestionar tus reservaciones
                    </p>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Sobre {restaurante.nombre}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {restaurante.descripcion || 'Disfruta de una experiencia gastronómica única en nuestro restaurante.'}
                </p>
                <div className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                  <p>{restaurante.direccion || `Ubicado en ${restaurante.ciudad}, México`}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Image and Map - 🔥 RESPONSIVE */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg overflow-hidden h-48 sm:h-64">
                <img
                  src={restaurante.imagen_url || 'https://via.placeholder.com/400x300'}
                  alt={restaurante.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mapa */}
              {debeMostrarMapa ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver en Google Maps"
                  className="rounded-lg overflow-hidden h-40 sm:h-48 block relative cursor-pointer hover:shadow-lg transition duration-300"
                >
                  <iframe
                    className="w-full h-full pointer-events-none"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    title="Mapa"
                  >
                  </iframe>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition duration-300">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-2" />
                    <span className="ml-2 text-sm sm:text-base text-white font-bold">Abrir en Mapas</span>
                  </div>
                </a>
              ) : (
                <div className="rounded-lg overflow-hidden h-40 sm:h-48 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  <p>Ubicación no disponible</p>
                </div>
              )}

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{restaurante.nombre}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  {restaurante.direccion || `${restaurante.ciudad}, Michoacán, México`}
                </p>
                <button
                  onClick={() => {
                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
                    window.open(mapUrl, '_blank');
                  }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  Obtener Direcciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reservación */}
      {!cargandoUsuario && (
        <ModalReservacion
          restaurante={restaurante}
          isOpen={modalReservaAbierto}
          onClose={() => {
            setModalReservaAbierto(false);
            cargarReservaciones();
          }}
          fechaSeleccionada={calendarDays[selectedDate]?.fullDate.toISOString()}
          numeroComensales={guests}
          usuario={usuario}
        />
      )}
    </>
  );
};

export default VistaDetalladaRestaurante;
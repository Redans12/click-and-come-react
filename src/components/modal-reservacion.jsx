import React, { useState, useEffect } from 'react';
import { X, Share2, Heart, MapPin, Calendar, Users, Sun, CreditCard, DollarSign } from 'lucide-react';
import { supabase } from '../config/supabaseClient';

const ModalReservacion = ({ restaurante, isOpen, onClose, fechaSeleccionada, numeroComensales, usuario }) => {
    const [paso, setPaso] = useState(1);
    const [selectedTime, setSelectedTime] = useState(null);
    const [notas, setNotas] = useState('');
    const [metodoPago, setMetodoPago] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [cargandoReserva, setCargandoReserva] = useState(false);

    const comision = 50; 
    const rangoPrecio = { min: 150, max: 500 };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 12; hour <= 20; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const time = `${hour > 12 ? hour - 12 : hour}:${min.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
                slots.push(time);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        if (!isOpen) {
            setPaso(1);
            setSelectedTime(null);
            setMetodoPago(null);
            setNotas('');
        }
    }, [isOpen]);
    
    if (!isOpen || !restaurante) return null;

    const formatearFecha = () => {
        if (!fechaSeleccionada) return 'No seleccionada';
        const fecha = new Date(fechaSeleccionada);
        return fecha.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleContinuar = () => {
        if (!selectedTime) {
            alert('Por favor selecciona un horario');
            return;
        }
        setPaso(2);
    };

    const handleReservar = async () => {
        if (!metodoPago) {
            alert('Por favor selecciona un método de pago');
            return;
        }
        if (!usuario?.id_usuario) {
            alert('Error: Usuario no autenticado.');
            return;
        }
        setCargandoReserva(true);
        
        const fechaBase = new Date(fechaSeleccionada);
        const [timePart, ampm] = selectedTime.split(' ');
        let [hour, minute] = timePart.split(':').map(Number);
        
        if (ampm === 'PM' && hour !== 12) {
            hour += 12;
        }
        if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }
        
        const fechaHoraUTC = new Date(
            fechaBase.getFullYear(),
            fechaBase.getMonth(),
            fechaBase.getDate(),
            hour,
            minute
        ).toISOString();
        
        try {
            const { data, error } = await supabase
                .from('reservaciones')
                .insert([
                    {
                        id_restaurante: restaurante.id_restaurante,
                        id_usuario: usuario.id_usuario,
                        fecha_hora: fechaHoraUTC,
                        cantidad_personas: parseInt(numeroComensales, 10),
                        estado: 'confirmada',
                        notas: notas,
                        monto_comision: comision,
                        metodo_pago_comision: metodoPago
                    },
                ])
                .select();
                
            if (error) {
                console.error('Error al insertar la reserva:', error);
                alert(`Error al guardar la reservación: ${error.message}`);
                return;
            }
            
            console.log('¡Reserva creada exitosamente!', data);
            alert('¡Reserva creada exitosamente! Tu mesa ha sido asegurada.');
            onClose(); 
        } catch (error) {
            console.error('Error general en handleReservar:', error);
            alert('Ocurrió un error inesperado al procesar la reserva.');
        } finally {
            setCargandoReserva(false);
        }
    };

    const handleShare = () => {
        alert(`Compartiendo ${restaurante.nombre}`);
    };

    const puedeReservar = usuario && usuario.rol === 'cliente';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            {/* 🔥 RESPONSIVE: w-full en mobile, max-w en desktop */}
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-auto">
                
                {/* Header del Modal - 🔥 RESPONSIVE */}
                <div className="bg-white border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                                <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                                    {paso === 1 ? 'Completa tu reserva' : 'Pago y Confirmación'}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
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
                            className="hidden sm:block px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* Contenido con Scroll - 🔥 RESPONSIVE */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-6">
                        {/* Columna Izquierda */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Info del Restaurante */}
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{restaurante.nombre}</h3>
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{formatearFecha()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{numeroComensales} Cliente{numeroComensales > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            
                            {/* VALIDACIÓN: Usuario no autenticado */}
                            {!usuario && (
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base sm:text-lg font-bold text-red-900 mb-2">Inicia sesión para reservar</h4>
                                            <p className="text-xs sm:text-sm text-red-700 mb-3 sm:mb-4">
                                                Para realizar una reservación, necesitas tener una cuenta de cliente activa.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => window.location.href = '/login'}
                                                    className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                                    </svg>
                                                    Iniciar Sesión
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = '/register'}
                                                    className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-colors text-sm">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                                    </svg>
                                                    Crear Cuenta
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VALIDACIÓN: Rol incorrecto */}
                            {usuario && !puedeReservar && (
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base sm:text-lg font-bold text-amber-900 mb-2">Acceso restringido</h4>
                                            <p className="text-xs sm:text-sm text-amber-700 mb-2 sm:mb-3">
                                                Tu cuenta tiene el rol de <span className="font-bold">{usuario.rol}</span>. Solo los usuarios con rol de <span className="font-bold">cliente</span> pueden realizar reservaciones.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contenido normal - 🔥 RESPONSIVE */}
                            {puedeReservar && (
                                <>
                                    {paso === 1 && (
                                        <div className="space-y-4">
                                            {/* Selección de Horario - 🔥 RESPONSIVE GRID */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Selecciona un horario</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {timeSlots.map((time, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`p-2 sm:p-3 text-xs sm:text-sm font-semibold rounded-lg transition ${
                                                                selectedTime === time
                                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Campo de Notas */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Notas Especiales (Opcional)</h4>
                                                <textarea
                                                    value={notas}
                                                    onChange={(e) => setNotas(e.target.value)}
                                                    rows="3"
                                                    placeholder="Ej: Necesitamos una silla de bebé, es un cumpleaños, etc."
                                                    className="w-full p-2 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                                ></textarea>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Política de cancelación</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    Aunque no se te cobrará nada si necesitas cancelar la reserva, te pedimos que lo hagas con al menos 24 horas de antelación.
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Acerca de</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    {restaurante.descripcion || `Ubicado en ${restaurante.direccion || restaurante.ciudad}. ${restaurante.nombre} ofrece una experiencia completa y variada en un ambiente 100% familiar.`}
                                                </p>
                                            </div>

                                            <div className="text-xs text-gray-500 pt-4 border-t">
                                                <p>
                                                    Toda transmisión de información de carácter personal se realiza a través de canales seguros. Al hacer clic en "Continuar", aceptas las
                                                    <a href="#" className="text-blue-600 underline"> Condiciones de uso</a> y la
                                                    <a href="#" className="text-blue-600 underline"> Política de privacidad</a>.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {paso === 2 && (
                                        <div className="space-y-4">
                                            {/* Información de la Reserva */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                                                    Tu Reserva
                                                </h4>
                                                <p className="text-base sm:text-lg font-bold text-gray-900">{formatearFecha()}</p>
                                                <p className="text-base sm:text-lg font-bold text-gray-900">{selectedTime} ({numeroComensales} personas)</p>
                                                {notas && <p className="text-xs sm:text-sm text-gray-600 mt-2">Notas: {notas}</p>}
                                            </div>
                                            
                                            {/* Comisión del servicio */}
                                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Comisión por uso de la plataforma</h4>
                                                <div className="flex justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-600">Comisión de servicio:</span>
                                                    <span className="font-semibold">${comision} MXN</span>
                                                </div>
                                                <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-300">
                                                    <span>Total a pagar ahora:</span>
                                                    <span>${comision} MXN</span>
                                                </div>
                                            </div>
                                            
                                            {/* Información de Precio por Persona */}
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                                                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                                                    Costo de la comida (pago en restaurante)
                                                </h4>
                                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                                    ${rangoPrecio.min} - ${rangoPrecio.max} MXN por persona
                                                </p>
                                            </div>

                                            {/* Selección de Método de Pago - 🔥 RESPONSIVE */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Método de pago (para la comisión)</h4>
                                                <div className="space-y-2 sm:space-y-3">
                                                    {/* Efectivo */}
                                                    <button
                                                        onClick={() => setMetodoPago('efectivo')}
                                                        className={`w-full p-3 sm:p-4 border-2 rounded-lg text-left transition flex items-center justify-between ${
                                                            metodoPago === 'efectivo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                                        }`}>
                                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                                            </div>
                                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Pagar en efectivo</span>
                                                        </div>
                                                        {metodoPago === 'efectivo' && (
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* PayPal */}
                                                    <button
                                                        onClick={() => setMetodoPago('paypal')}
                                                        className={`w-full p-3 sm:p-4 border-2 rounded-lg text-left transition flex items-center justify-between ${
                                                            metodoPago === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                                        }`}>
                                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                                            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
                                                            <span className="font-medium text-gray-900 text-sm sm:text-base">PayPal</span>
                                                        </div>
                                                        {metodoPago === 'paypal' && (
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Tarjetas */}
                                                    <button
                                                        onClick={() => setMetodoPago('tarjeta')}
                                                        className={`w-full p-3 sm:p-4 border-2 rounded-lg text-left transition flex items-center justify-between ${
                                                            metodoPago === 'tarjeta' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                                        }`}>
                                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                                            <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 flex-shrink-0" />
                                                            <span className="font-medium text-gray-900 text-sm sm:text-base">Tarjeta de crédito/débito</span>
                                                        </div>
                                                        {metodoPago === 'tarjeta' && (
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Nota adicional */}
                                            <div className="flex items-start space-x-2 text-xs text-gray-500 mt-4">
                                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                                <p className="leading-relaxed">
                                                    Tu información está protegida. Al continuar, aceptas nuestros términos y condiciones.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Columna Derecha: Imágenes y Mapa - 🔥 RESPONSIVE */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Imagen Principal - 🔥 ALTURA RESPONSIVE */}
                            <div className="rounded-lg overflow-hidden h-48 sm:h-64 lg:h-80">
                                <img 
                                    src={restaurante.imagen_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'} 
                                    alt={restaurante.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Galería miniatura - 🔥 RESPONSIVE */}
                            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                                {[restaurante.imagen_url, ...Array(4).fill(null)].slice(0, 5).map((img, index) => (
                                    <div key={index} className={`rounded overflow-hidden h-12 sm:h-16 ${index === 0 && img ? 'ring-2 ring-blue-500' : ''} ${img ? 'cursor-pointer hover:opacity-75' : 'bg-gray-100 flex items-center justify-center'} transition`}>
                                        {img ? (
                                            <img src={img} alt={`${restaurante.nombre} - ${index + 1}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Mapa - 🔥 ALTURA RESPONSIVE */}
                            {(restaurante.direccion || restaurante.ciudad) && (
                                <div className="rounded-lg overflow-hidden h-40 sm:h-48">
                                    <iframe
                                        className="w-full h-full"
                                        style={{border: 0}}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent((restaurante.direccion || '') + ', ' + (restaurante.ciudad || 'México'))}&output=embed`}
                                        title="Mapa del restaurante"
                                    >
                                    </iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Fijo con Botón - 🔥 RESPONSIVE */}
                <div className="bg-white border-t px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
                    {puedeReservar ? (
                        <>
                            {paso === 1 && (
                                <button
                                    onClick={handleContinuar}
                                    disabled={!selectedTime}
                                    className={`w-full font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base ${
                                        selectedTime 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}>
                                    Continuar
                                </button>
                            )}
                            {paso === 2 && (
                                <div className="flex gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setPaso(1)}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base">
                                        Volver
                                    </button>
                                    <button
                                        onClick={handleReservar}
                                        disabled={!metodoPago || cargandoReserva}
                                        className={`flex-1 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base ${
                                            metodoPago && !cargandoReserva
                                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}>
                                        {cargandoReserva ? 'Procesando...' : 'Confirmar Reservación'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg cursor-not-allowed text-sm sm:text-base">
                            {!usuario ? 'Inicia sesión para continuar' : 'No puedes hacer reservaciones con este rol'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalReservacion;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import {
  Calendar,
  Clock,
  CheckCircle,
  ClipboardList,
  FileText,
  Headphones,
} from "lucide-react";

function DuenoDashboard() {
  const navigate = useNavigate();
  const [reservaciones, setReservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Obtener usuario actual
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    cargarReservaciones();
  }, []);

  const cargarReservaciones = async () => {
    try {
      // Obtener restaurante del dueño
      const { data: restaurante, error: restauranteError } = await supabase
        .from("restaurantes")
        .select("id_restaurante")
        .eq("id_dueno", user.id_usuario)
        .single();

      if (restauranteError) throw restauranteError;

      // Obtener reservaciones del restaurante
      const { data, error } = await supabase
        .from("reservaciones")
        .select(
          `
          *,
          usuario:id_usuario (
            nombre,
            email
          ),
          restaurante:id_restaurante (
            nombre,
            imagen_url
          )
        `
        )
        .eq("id_restaurante", restaurante.id_restaurante)
        .order("fecha_hora", { ascending: false });

      if (error) throw error;

      setReservaciones(data || []);
    } catch (error) {
      console.error("Error cargando reservaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (idReservacion) => {
    try {
      const { error } = await supabase
        .from("reservaciones")
        .update({ estado: "confirmada" })
        .eq("id_reservacion", idReservacion);

      if (error) throw error;

      mostrarAlerta("Asistencia confirmada.");
      cargarReservaciones();
    } catch (error) {
      console.error("Error confirmando reservación:", error);
    }
  };

  const handleReportar = async (idReservacion) => {
    try {
      const { error } = await supabase
        .from("reservaciones")
        .update({ estado: "no_asistio" })
        .eq("id_reservacion", idReservacion);

      if (error) throw error;

      mostrarAlerta("Se reportó la no asistencia.");
      cargarReservaciones();
    } catch (error) {
      console.error("Error reportando reservación:", error);
    }
  };

  const mostrarAlerta = (mensaje) => {
    setAlertMessage(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Calcular estadísticas
  const pendientes = reservaciones.filter(
    (r) => r.estado === "pendiente"
  ).length;
  const confirmadas = reservaciones.filter(
    (r) => r.estado === "confirmada"
  ).length;
  const totalReservas = reservaciones.length;

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: {
        text: "Pendiente",
        color: "bg-orange-100 text-orange-600",
        icon: "🕐",
      },
      confirmada: {
        text: "Asistió",
        color: "bg-green-100 text-green-600",
        icon: "✓",
      },
      no_asistio: {
        text: "No Asistió",
        color: "bg-red-100 text-red-600",
        icon: "✕",
      },
    };
    return badges[estado] || badges.pendiente;
  };

  const formatearFecha = (fechaHora) => {
    const fecha = new Date(fechaHora);
    const opciones = { day: "2-digit", month: "short", year: "numeric" };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
    const hora = fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { fecha: fechaFormateada, hora };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Dueño
              </h1>
              <p className="text-sm text-gray-600">
                Administra tus reservaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Mis Reservaciones */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Mis Reservaciones</h2>
              <p className="text-red-100">
                Gestiona confirmaciones y reportes de asistencia
              </p>
            </div>
            <button
              onClick={() => navigate("/dueno/reportes")}
              className="flex items-center gap-2 bg-white text-red-500 px-6 py-3 rounded-lg hover:bg-red-50 transition font-medium"
            >
              <FileText className="w-5 h-5" />
              Ver Reportes
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de confirmación */}
      {showAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-6">
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pendientes */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 text-white">
              <Clock className="w-8 h-8 mb-4" />
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {pendientes}
              </h3>
              <p className="text-gray-600 font-medium mb-2">Pendientes</p>
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Requieren atención
              </div>
            </div>
          </div>

          {/* Confirmadas */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 text-white">
              <CheckCircle className="w-8 h-8 mb-4" />
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {confirmadas}
              </h3>
              <p className="text-gray-600 font-medium mb-2">Confirmadas</p>
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Clientes asistieron
              </div>
            </div>
          </div>

          {/* Total Reservas */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white">
              <ClipboardList className="w-8 h-8 mb-4" />
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {totalReservas}
              </h3>
              <p className="text-gray-600 font-medium mb-2">Total Reservas</p>
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Historial completo
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Reservaciones */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Lista de Reservaciones</h2>
              <p className="text-red-100">
                {totalReservas} reservaciones registradas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-6">
          <div className="space-y-6">
            {reservaciones.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay reservaciones</p>
              </div>
            ) : (
              reservaciones.map((reserva) => {
                const { fecha, hora } = formatearFecha(reserva.fecha_hora);
                const badge = getEstadoBadge(reserva.estado);

                return (
                  <div
                    key={reserva.id_reservacion}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex gap-4">
                      {/* Imagen del restaurante */}
                      <div className="relative">
                        <img
                          src={
                            reserva.restaurante.imagen_url ||
                            "/placeholder-restaurant.jpg"
                          }
                          alt={reserva.restaurante.nombre}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-1">
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Información */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {reserva.restaurante.nombre}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                          {reserva.usuario.nombre}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Fecha y Hora */}
                          <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-orange-600 text-xs font-semibold mb-1 uppercase">
                              Fecha y Hora
                            </p>
                            <p className="text-gray-900 font-bold">{fecha}</p>
                            <p className="text-gray-600 text-sm">{hora}</p>
                          </div>

                          {/* Personas */}
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-blue-600 text-xs font-semibold mb-1 uppercase">
                              Personas
                            </p>
                            <p className="text-gray-900 font-bold text-2xl">
                              {reserva.numero_personas}
                            </p>
                            <p className="text-gray-600 text-sm">personas</p>
                          </div>
                        </div>

                        {/* Badge de estado */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${badge.color}`}
                          >
                            <span>{badge.icon}</span>
                            {badge.text}
                          </span>
                        </div>

                        {/* Botones de acción (solo para pendientes) */}
                        {reserva.estado === "pendiente" && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() =>
                                handleConfirmar(reserva.id_reservacion)
                              }
                              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Confirmar
                            </button>
                            <button
                              onClick={() =>
                                handleReportar(reserva.id_reservacion)
                              }
                              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
                            >
                              ✕ Reportar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer de ayuda */}
        <div className="bg-gray-900 rounded-xl p-6 mt-8 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-lg mb-1">¿Necesitas ayuda?</h3>
            <p className="text-gray-400 text-sm">
              Consulta nuestra documentación o contacta soporte
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium">
              <FileText className="w-5 h-5" />
              Documentación
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition font-medium">
              <Headphones className="w-5 h-5" />
              Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DuenoDashboard;

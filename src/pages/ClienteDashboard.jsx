import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../config/supabaseClient";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
import ModalCalificacion from "../components/ModalCalificacion";

function ClienteDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [reservaciones, setReservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("proximas"); // 'proximas' o 'historial'
  const [modalCalificacionAbierto, setModalCalificacionAbierto] =
    useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  useEffect(() => {
    if (user) {
      cargarReservaciones();
    }
  }, [user]);

  const cargarReservaciones = async () => {
    try {
      setLoading(true);

      console.log("🔍 ===== CARGANDO RESERVACIONES =====");
      console.log("🔍 Usuario:", user.nombre, "(ID:", user.id_usuario + ")");

      // 1. Obtener reservaciones del usuario
      const { data: reservacionesData, error: reservacionesError } =
        await supabase
          .from("reservaciones")
          .select("*")
          .eq("id_usuario", user.id_usuario)
          .order("fecha_hora", { ascending: false });

      if (reservacionesError) {
        console.error("❌ Error obteniendo reservaciones:", reservacionesError);
        throw reservacionesError;
      }

      console.log(
        "✅ Reservaciones encontradas:",
        reservacionesData?.length || 0
      );

      if (!reservacionesData || reservacionesData.length === 0) {
        console.log("⚠️ No hay reservaciones para este usuario");
        setReservaciones([]);
        return;
      }

      // 2. Obtener IDs únicos de restaurantes
      const restauranteIds = [
        ...new Set(reservacionesData.map((r) => r.id_restaurante)),
      ];
      console.log("🔍 IDs de restaurantes:", restauranteIds);

      // 3. Obtener información de restaurantes
      const { data: restaurantesData, error: restaurantesError } =
        await supabase
          .from("restaurantes")
          .select(
            "id_restaurante, nombre, imagen_url, ciudad, direccion, tipo_comida"
          )
          .in("id_restaurante", restauranteIds);

      if (restaurantesError) {
        console.error("❌ Error obteniendo restaurantes:", restaurantesError);
        throw restaurantesError;
      }

      console.log(
        "✅ Restaurantes encontrados:",
        restaurantesData?.length || 0
      );

      // 4. Obtener reseñas si existen
      const reservacionIds = reservacionesData.map((r) => r.id_reservacion);
      const { data: resenasData } = await supabase
        .from("resenas")
        .select("*")
        .in("id_reservacion", reservacionIds);

      console.log("✅ Reseñas encontradas:", resenasData?.length || 0);

      // 5. Combinar los datos manualmente
      const reservacionesCompletas = reservacionesData.map((reserva) => {
        const restaurante = restaurantesData?.find(
          (r) => r.id_restaurante === reserva.id_restaurante
        );
        const resenas =
          resenasData?.filter(
            (r) => r.id_reservacion === reserva.id_reservacion
          ) || [];

        return {
          ...reserva,
          restaurantes: restaurante || {
            nombre: "Restaurante no encontrado",
            imagen_url: "",
            ciudad: "",
            direccion: "",
            tipo_comida: "",
          },
          resenas: resenas,
        };
      });

      console.log("✅ Reservaciones completas:", reservacionesCompletas);
      setReservaciones(reservacionesCompletas);
    } catch (error) {
      console.error("❌ Error completo:", error);
      setReservaciones([]);
    } finally {
      setLoading(false);
      console.log("🔍 ===== FIN CARGA RESERVACIONES =====\n");
    }
  };

  const handleCancelarReserva = async (idReservacion) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("¿Estás seguro de que deseas cancelar esta reservación?"))
      return;

    try {
      const { error } = await supabase
        .from("reservaciones")
        .update({ estado: "cancelada" })
        .eq("id_reservacion", idReservacion);

      if (error) throw error;

      alert("Reservación cancelada exitosamente");
      cargarReservaciones();
    } catch (error) {
      console.error("Error cancelando reservación:", error);
      alert("Error al cancelar la reservación");
    }
  };

  const handleDejarResena = (reserva) => {
    setReservaSeleccionada(reserva);
    setModalCalificacionAbierto(true);
  };

  const puedeCalificar = (reserva) => {
    const fechaReserva = new Date(reserva.fecha_hora);
    const ahora = new Date();
    const yaCalificado = reserva.resenas && reserva.resenas.length > 0;

    return (
      fechaReserva < ahora && !yaCalificado && reserva.estado === "confirmada"
    );
  };

  const formatearFecha = (fechaHora) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearHora = (fechaHora) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { text: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      confirmada: { text: "Completada", color: "bg-green-100 text-green-800" },
      cancelada: { text: "Cancelada", color: "bg-red-100 text-red-800" },
    };
    return badges[estado] || badges.pendiente;
  };

  // Filtrar reservaciones
  const ahora = new Date();
  const proximasReservaciones = reservaciones.filter((r) => {
    const fechaReserva = new Date(r.fecha_hora);
    return fechaReserva >= ahora && r.estado !== "cancelada";
  });

  const historialReservaciones = reservaciones.filter((r) => {
    const fechaReserva = new Date(r.fecha_hora);
    return fechaReserva < ahora || r.estado === "cancelada";
  });

  const reservacionesMostradas =
    activeTab === "proximas" ? proximasReservaciones : historialReservaciones;

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Bienvenido, {user.nombre}!
              </h1>
              <p className="text-gray-600 mt-1">
                Aquí puedes ver y gestionar todas tus reservaciones.
              </p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("proximas")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "proximas"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Próximas Reservaciones
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === "proximas"
                  ? "bg-white text-red-500"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {proximasReservaciones.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("historial")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "historial"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Historial
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === "historial"
                  ? "bg-white text-red-500"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {historialReservaciones.length}
            </span>
          </button>
        </div>

        {/* Lista de Reservaciones */}
        <div className="space-y-6">
          {reservacionesMostradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No hay reservaciones
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "proximas"
                  ? "Aún no tienes reservaciones próximas."
                  : "No tienes historial de reservaciones."}
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Explorar Restaurantes
              </button>
            </div>
          ) : (
            reservacionesMostradas.map((reserva) => {
              const badge = getEstadoBadge(reserva.estado);
              const puedeDejarResena = puedeCalificar(reserva);
              const yaCalificado =
                reserva.resenas && reserva.resenas.length > 0;

              return (
                <div
                  key={reserva.id_reservacion}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="flex gap-6 p-6">
                    {/* Imagen del Restaurante */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          reserva.restaurantes.imagen_url ||
                          "https://via.placeholder.com/200"
                        }
                        alt={reserva.restaurantes.nombre}
                        className="w-48 h-48 rounded-lg object-cover"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {reserva.restaurantes.nombre}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <span>{reserva.restaurantes.tipo_comida}</span>
                            <span>•</span>
                            <MapPin className="w-4 h-4" />
                            <span>{reserva.restaurantes.ciudad}</span>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${badge.color}`}
                        >
                          {badge.text}
                        </span>
                      </div>

                      {/* Detalles de la Reserva */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Fecha</span>
                          </div>
                          <p className="text-gray-900 font-bold">
                            {formatearFecha(reserva.fecha_hora)}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Hora</span>
                          </div>
                          <p className="text-gray-900 font-bold">
                            {formatearHora(reserva.fecha_hora)}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <Users className="w-4 h-4" />
                            <span>Personas</span>
                          </div>
                          <p className="text-gray-900 font-bold">
                            {reserva.cantidad_personas}
                          </p>
                        </div>
                      </div>

                      {/* Calificación si existe */}
                      {yaCalificado && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Tu calificación:
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= reserva.resenas[0].calificacion
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({reserva.resenas[0].calificacion}/5)
                            </span>
                          </div>
                          {reserva.resenas[0].comentario && (
                            <p className="text-sm text-gray-600 italic">
                              "{reserva.resenas[0].comentario}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Botones de Acción */}
                      <div className="flex gap-3">
                        {activeTab === "proximas" &&
                          reserva.estado === "confirmada" && (
                            <button
                              onClick={() =>
                                handleCancelarReserva(reserva.id_reservacion)
                              }
                              className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                            >
                              Cancelar Reserva
                            </button>
                          )}

                        {puedeDejarResena && (
                          <button
                            onClick={() => handleDejarResena(reserva)}
                            className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
                          >
                            <Star className="w-5 h-5" />
                            Calificar Restaurante
                          </button>
                        )}

                        <button
                          onClick={() =>
                            navigate(`/restaurantes/${reserva.id_restaurante}`)
                          }
                          className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                          Ver Restaurante
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Calificación */}
      {modalCalificacionAbierto && reservaSeleccionada && (
        <ModalCalificacion
          isOpen={modalCalificacionAbierto}
          onClose={() => {
            setModalCalificacionAbierto(false);
            setReservaSeleccionada(null);
            cargarReservaciones();
          }}
          reservacion={reservaSeleccionada}
          usuario={user}
        />
      )}
    </div>
  );
}

export default ClienteDashboard;

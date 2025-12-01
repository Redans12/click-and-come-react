import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Utensils,
  Calendar,
  DollarSign,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { supabase } from "../../config/supabaseClient";
import { restauranteService } from "../../services/restauranteService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalRestaurantes: 0,
    reservasHoy: 0,
    balance: 0,
  });
  const [restaurantes, setRestaurantes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // 'todos', 'activos', 'inactivos'

  // Cargar datos
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Obtener TODOS los restaurantes (activos e inactivos)
      const { data: rawRestaurantes, error: restError } = await supabase
        .from("restaurantes")
        .select("*")
        .order("fecha_creacion", { ascending: false });

      if (restError) throw restError;

      const safeRestaurantes = rawRestaurantes || [];
      setRestaurantes(safeRestaurantes);

      // 2. Obtener usuarios
      const { data: rawUsuarios } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false });

      const safeUsuarios = rawUsuarios || [];
      setUsuarios(safeUsuarios);

      // 3. Actualizar estadísticas
      setStats({
        totalUsuarios: safeUsuarios.length,
        totalRestaurantes: safeRestaurantes.length,
        reservasHoy: 0,
        balance: 0,
      });
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (restaurante) => {
    try {
      const { error } = await supabase
        .from("restaurantes")
        .update({ activo: !restaurante.activo })
        .eq("id_restaurante", restaurante.id_restaurante);

      if (error) throw error;

      // Recargar datos
      fetchDashboardData();
      alert(
        `Restaurante ${
          !restaurante.activo ? "activado" : "desactivado"
        } exitosamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del restaurante");
    }
  };

  // Filtrar restaurantes por búsqueda y estado
  const filteredRestaurantes = (restaurantes || [])
    .filter((r) => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((r) => {
      if (filtroEstado === "activos") return r.activo === true;
      if (filtroEstado === "inactivos") return r.activo === false;
      return true; // 'todos'
    });

  // Contar restaurantes por estado
  const contadores = {
    todos: restaurantes.length,
    activos: restaurantes.filter((r) => r.activo === true).length,
    inactivos: restaurantes.filter((r) => r.activo === false).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel de Administrador</h1>
              <p className="text-red-100">
                Gestiona tu plataforma de restaurantes
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <h2 className="text-2xl font-bold">¡Bienvenido, Administrador!</h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Usuarios */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalUsuarios}</h3>
            <p className="text-blue-100 text-sm">Total Usuarios</p>
            <p className="text-xs text-blue-200 mt-2">vs. mes anterior</p>
          </div>

          {/* Total Restaurantes */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Utensils className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                +8%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {stats.totalRestaurantes}
            </h3>
            <p className="text-red-100 text-sm">Total Restaurantes</p>
            <p className="text-xs text-red-200 mt-2">
              {contadores.activos} activos, {contadores.inactivos} inactivos
            </p>
          </div>

          {/* Reservas Hoy */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Hoy
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.reservasHoy}</h3>
            <p className="text-teal-100 text-sm">Reservas Hoy</p>
            <p className="text-xs text-teal-200 mt-2">5 pendientes</p>
          </div>

          {/* Balance */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Hoy
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">${stats.balance}.00</h3>
            <p className="text-purple-100 text-sm">Balance</p>
            <p className="text-xs text-purple-200 mt-2">Próximamente</p>
          </div>
        </div>

        {/* Gestión de Restaurantes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Restaurantes
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredRestaurantes.length} restaurantes{" "}
                  {filtroEstado !== "todos" && `(${filtroEstado})`}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/restaurantes/crear")}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Añadir
            </button>
          </div>

          {/* Buscador */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar restaurante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filtrar por estado:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroEstado("todos")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filtroEstado === "todos"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos ({contadores.todos})
              </button>
              <button
                onClick={() => setFiltroEstado("activos")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filtroEstado === "activos"
                    ? "bg-green-500 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                ✓ Activos ({contadores.activos})
              </button>
              <button
                onClick={() => setFiltroEstado("inactivos")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filtroEstado === "inactivos"
                    ? "bg-red-500 text-white"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                ✕ Inactivos ({contadores.inactivos})
              </button>
            </div>
          </div>

          {/* Grid de Restaurantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurantes.map((restaurante) => (
              <div
                key={restaurante.id_restaurante}
                className={`border rounded-lg overflow-hidden hover:shadow-lg transition ${
                  !restaurante.activo
                    ? "border-gray-300 bg-gray-50 opacity-75"
                    : "border-gray-200"
                }`}
              >
                {/* Imagen */}
                <div className="relative h-48">
                  <img
                    src={
                      restaurante.imagen_url ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={restaurante.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      restaurante.activo
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {restaurante.activo ? "✓ Activo" : "✕ Inactivo"}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                    {restaurante.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>📍 {restaurante.ciudad}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>👤 Dueño ID: {restaurante.id_dueno || "Sin asignar"}</p>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/restaurantes/${restaurante.id_restaurante}/editar`
                        )
                      }
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(restaurante)}
                      className={`flex-1 py-2 rounded-lg transition font-medium text-sm ${
                        restaurante.activo
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >
                      {restaurante.activo ? "🚫 Desactivar" : "✅ Activar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay resultados */}
          {filteredRestaurantes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Utensils className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                No se encontraron restaurantes
              </p>
              <p className="text-sm">
                {searchTerm
                  ? "Intenta con otro término de búsqueda"
                  : "Comienza añadiendo tu primer restaurante"}
              </p>
            </div>
          )}
        </div>

        {/* Gestión de Usuarios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Gestión de Usuarios
              </h2>
              <p className="text-sm text-gray-500">
                {usuarios.length} usuarios registrados
              </p>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    USUARIO
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    EMAIL
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    ROL
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    ESTADO
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.slice(0, 10).map((usuario) => (
                  <tr
                    key={usuario.id_usuario}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {usuario.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            Registrado hace {Math.floor(Math.random() * 30)}{" "}
                            días
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {usuario.email}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          usuario.rol === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {usuario.rol === "admin" ? "Admin" : "Cliente"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          !usuario.esta_bloqueado
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {!usuario.esta_bloqueado ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          👁️
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          ✏️
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition text-red-600">
                          🔒
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer de Ayuda */}
        <div className="bg-gray-900 rounded-xl p-6 mt-8 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-lg mb-1">
              ¿Necesitas ayuda con la gestión?
            </h3>
            <p className="text-gray-400 text-sm">
              Consulta nuestra documentación o contacta soporte técnico
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium">
              📚 Documentación
            </button>
            <button className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition font-medium">
              🔧 Soporte Técnico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
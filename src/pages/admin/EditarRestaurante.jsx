import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Store, Tag, Settings, AlertCircle } from "lucide-react";
import { supabase } from "../../config/supabaseClient";

const EditarRestaurante = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    tipo_comida: "",
    rango_precio: "$",
    calificacion_promedio: 0,
    imagen_url: "",
    id_dueno: null,
    activo: true,
    auto_seleccion: true,
  });

  // Cargar datos del restaurante
  useEffect(() => {
    fetchRestaurante();
  }, [id]);

  const fetchRestaurante = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurantes")
        .select("*")
        .eq("id_restaurante", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          nombre: data.nombre || "",
          ciudad: data.ciudad || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          descripcion: data.descripcion || "",
          tipo_comida: data.tipo_comida || "",
          rango_precio: data.rango_precio || "$",
          calificacion_promedio: data.calificacion_promedio || 0,
          imagen_url: data.imagen_url || "",
          id_dueno: data.id_dueno || null,
          activo: data.activo !== false,
          auto_seleccion: true,
        });
      }
    } catch (error) {
      console.error("Error cargando restaurante:", error);
      alert("Error al cargar el restaurante");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("restaurantes")
        .update({
          nombre: formData.nombre,
          ciudad: formData.ciudad,
          telefono: formData.telefono,
          direccion: formData.direccion,
          descripcion: formData.descripcion,
          tipo_comida: formData.tipo_comida,
          rango_precio: formData.rango_precio,
          calificacion_promedio: parseFloat(formData.calificacion_promedio),
          imagen_url: formData.imagen_url,
          id_dueno: formData.id_dueno || null,
          activo: formData.activo,
        })
        .eq("id_restaurante", id);

      if (error) throw error;

      alert("¡Restaurante actualizado exitosamente!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error actualizando restaurante:", error);
      alert("Error al actualizar el restaurante: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Editar Restaurante
                </h1>
                <p className="text-sm text-gray-500">{formData.nombre}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Azul */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={formData.imagen_url || "https://via.placeholder.com/80"}
              alt={formData.nombre}
              className="w-20 h-20 rounded-lg object-cover border-2 border-white"
            />
            <div>
              <h2 className="text-2xl font-bold">
                Editando: {formData.nombre}
              </h2>
              <div className="flex items-center gap-2 text-blue-100 mt-1">
                <span>📍 {formData.ciudad}</span>
                <span>•</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    formData.activo ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {formData.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg inline-flex">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Última actualización: Sin registro</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Información Principal */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-blue-500 text-white px-6 py-4 flex items-center gap-3">
            <Store className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Información Principal</h3>
              <p className="text-sm text-blue-100">
                Datos básicos del restaurante
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Nombre del Restaurante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Restaurante *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Ciudad y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dirección Completa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Completa *
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Detalles y Clasificación */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gray-800 text-white px-6 py-4 flex items-center gap-3">
            <Tag className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Detalles y Clasificación</h3>
              <p className="text-sm text-gray-300">
                Tipo de comida y rango de precios
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tipo de Comida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Comida *
                </label>
                <input
                  type="text"
                  name="tipo_comida"
                  value={formData.tipo_comida}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Rango de Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Precio
                </label>
                <select
                  name="rango_precio"
                  value={formData.rango_precio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="$">💵 $ - Económico</option>
                  <option value="$$">💵💵 $$ - Moderado</option>
                  <option value="$$$">💵💵💵 $$$ - Caro</option>
                  <option value="$$$$">💵💵💵💵 $$$$ - Muy Caro</option>
                </select>
              </div>

              {/* Calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="calificacion_promedio"
                    value={formData.calificacion_promedio}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-yellow-500 text-2xl">⭐</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">De 0 a 5 estrellas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-red-700 text-white px-6 py-4 flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Configuración</h3>
              <p className="text-sm text-red-100">Imagen, dueño y opciones</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Imagen Actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Actual
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={formData.imagen_url || "https://via.placeholder.com/100"}
                  alt={formData.nombre}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                    {formData.imagen_url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Modifica la ruta abajo para cambiar la imagen
                  </p>
                </div>
              </div>
            </div>

            {/* Ruta de Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta de Imagen (URL) *
              </label>
              <input
                type="text"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Asignar Dueño */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dueño Asignado
              </label>
              <select
                name="id_dueno"
                value={formData.id_dueno || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Sin Asignar --</option>
                {/* Aquí puedes cargar dinámicamente los dueños */}
              </select>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Restaurante Activo</p>
                <p className="text-sm text-gray-500">
                  El restaurante será visible para los usuarios
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Incluir en Auto-selección
                </p>
                <p className="text-sm text-gray-500">
                  Aparecerá en las secciones destacadas automáticamente
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="auto_seleccion"
                  checked={formData.auto_seleccion}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Info del ID */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            ID del restaurante: <span className="font-bold">{id}</span>
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            ✕ Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "⏳ Guardando Cambios..." : "✓ Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarRestaurante;

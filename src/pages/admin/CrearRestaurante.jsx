import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, Tag, Settings, AlertCircle } from "lucide-react";
import { supabase } from "../../config/supabaseClient";

const CrearRestaurante = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "Morelia",
    telefono: "",
    direccion: "",
    descripcion: "",
    tipo_comida: "",
    rango_precio: "$",
    calificacion_inicial: 0,
    imagen_url: "",
    id_dueno: null,
    activo: true,
    auto_seleccion: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("restaurantes")
        .insert([
          {
            nombre: formData.nombre,
            ciudad: formData.ciudad,
            telefono: formData.telefono,
            direccion: formData.direccion,
            descripcion: formData.descripcion,
            tipo_comida: formData.tipo_comida,
            rango_precio: formData.rango_precio,
            calificacion_promedio: parseFloat(formData.calificacion_inicial),
            imagen_url: formData.imagen_url,
            id_dueno: formData.id_dueno || null,
            activo: formData.activo,
          },
        ])
        .select();

      if (error) throw error;

      alert("¡Restaurante creado exitosamente!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creando restaurante:", error);
      alert("Error al crear el restaurante: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="bg-orange-500 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Añadir Nuevo Restaurante
                </h1>
                <p className="text-sm text-gray-500">
                  Completa la información del restaurante
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Rojo */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Nuevo Restaurante</h2>
              <p className="text-red-100">
                Agrega un nuevo restaurante a la plataforma
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg inline-flex">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Todos los campos con * son obligatorios
            </span>
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
                  placeholder="Ej: Restaurante El Buen Sabor"
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
                  placeholder="Morelia"
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
                  placeholder="(443) 123-4567"
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
                placeholder="Av. Principal #123, Col. Centro"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción / Acerca de
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el ambiente, especialidades y lo que hace único a este restaurante..."
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
                  placeholder="Ej: Mexicana, Italiana..."
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

              {/* Calificación Inicial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación Inicial
                </label>
                <input
                  type="number"
                  name="calificacion_inicial"
                  value={formData.calificacion_inicial}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.5"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                placeholder="images/restaurantes/mi-restaurante.jpg"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ruta relativa desde la carpeta public
              </p>
            </div>

            {/* Asignar Dueño */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignar Dueño
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
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
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
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Advertencia */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Revisa la información antes de guardar
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
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Guardando..." : "✓ Guardar Restaurante"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRestaurante;

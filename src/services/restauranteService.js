import { supabase } from '../config/supabaseClient';

export const restauranteService = {
  // Obtener todos los restaurantes activos
  async getRestaurantes() {
    try {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('activo', true)
        .order('calificacion_promedio', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo restaurantes:', error);
      throw error;
    }
  },

  // Obtener un restaurante por ID
  async getRestauranteById(id) {
    try {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id_restaurante', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo restaurante:', error);
      throw error;
    }
  },

  // Filtrar restaurantes por ciudad
  async getRestaurantesByCiudad(ciudad) {
    try {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('activo', true)
        .eq('ciudad', ciudad)
        .order('calificacion_promedio', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error filtrando restaurantes:', error);
      throw error;
    }
  },

  // Filtrar por tipo de comida
  async getRestaurantesByTipo(tipoComida) {
    try {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('activo', true)
        .eq('tipo_comida', tipoComida)
        .order('calificacion_promedio', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error filtrando restaurantes:', error);
      throw error;
    }
  }
};
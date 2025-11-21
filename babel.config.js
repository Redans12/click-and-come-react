module.exports = {
  presets: [
    // Usar la versión correcta del preset para el entorno actual
    // Esto asegura que el código moderno de JavaScript se transpila
    '@babel/preset-env',
    
    // Habilitar el soporte para JSX
    ['@babel/preset-react', {
      // Usar la transformación automática de JSX (desde React 17+, compatible con React 19)
      'runtime': 'automatic'
    }],
  ],
  // Opcional: plugins adicionales si se usan funcionalidades experimentales
  // plugins: [],
};
// src/tests/AdminRestaurante.test.js

// Importamos solo lo necesario para la renderización básica de React Testing Library
import { render, screen } from '@testing-library/react';
// Importa el componente que deseas probar (ajusta la ruta según sea necesario)
import AdminDashboard from '../pages/admin/AdminDashboard'; 
import { BrowserRouter } from 'react-router-dom';
import CrearRestaurante from '../pages/admin/CrearRestaurante'; // Ajusta la ruta si es necesario

// 🚨 SIMPLIFICACIÓN CLAVE: Mockear la dependencia AuthContext
// Puesto que tu componente probablemente usa AuthContext, lo creamos y proporcionamos aquí.
const MockAuthContext = {
    user: { roles: ['admin'] },
    isAuthenticated: true
};

// Si el componente requiere el AuthContext
const renderWithMinimalAuth = (component) => {
    return render(
        <BrowserRouter>
            {/* Si tienes un AuthContext, necesitas importarlo y usarlo */}
            {/* Si no lo importas, reemplaza 'AuthContext.Provider' con un simple fragmento */}
            {/* Reemplaza 'AuthContext' con la importación real si es necesario */}
            {/* <AuthContext.Provider value={MockAuthContext}> */}
                {component}
            {/* </AuthContext.Provider> */}
        </BrowserRouter>
    );
};


describe('AdminRestaurante - PRUEBA DE ESTABILIDAD', () => {

    /**
     * Test 1: Prueba de renderizado básico
     * Objetivo: Confirmar que el entorno Jest/JSDOM funciona y puede renderizar React.
     */
    test('El componente se renderiza sin errores', () => {
        
        // Renderiza el componente AdminRestaurante (ajusta a tu nombre real si es diferente)
        renderWithMinimalAuth(<AdminComponent />); 

        // Una aserción muy simple para confirmar que el entorno está activo
        // Reemplaza 'Administración de Restaurantes' por un texto real que sepas que renderiza el componente.
        const headerElement = screen.getByText(/Administración de Restaurantes/i);
        expect(headerElement).toBeInTheDocument();
    });

    /**
     * Si la prueba anterior pasa, puedes empezar a añadir pruebas más complejas aquí.
     * Si no pasa, el problema es DEFINITIVAMENTE la configuración de Jest o JSDOM.
     */
});
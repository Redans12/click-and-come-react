import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CrearRestaurante from '../pages/admin/CrearRestaurante'; // Ajusta la ruta si es necesario

// --- 1. MOCK: Navegación de React Router Dom ---
// Usaremos un mock para asegurarnos de que `useNavigate` no falle y podamos espiar si fue llamado.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    // Dejamos BrowserRouter sin mockear, ya que es un componente que JSDOM maneja bien
    BrowserRouter: ({ children }) => <div>{children}</div>,
    useNavigate: () => mockNavigate,
}));

// --- 2. MOCK: Cliente Supabase ---
// Mockeamos el cliente Supabase para controlar las respuestas de inserción.
const mockSelect = jest.fn();
const mockInsert = jest.fn(() => ({
    select: mockSelect,
}));

const mockSupabase = {
    from: jest.fn(() => ({
        insert: mockInsert,
    })),
};

// Asegúrate de que esta ruta coincida con la ruta de importación en tu componente
// Desde src/tests/
// Subir un nivel (a src/) y luego entrar a config/
jest.mock('../config/supabaseClient', () => ({ 
    supabase: mockSupabase,
}));


describe('CrearRestaurante Component Tests', () => {
    // Helper para renderizar el componente dentro del contexto de router
    const renderComponent = () => {
        // En este componente, no estamos usando AuthContext directamente, solo router.
        // Si tu componente necesita AuthContext, agrégalo aquí.
        return render(
            <BrowserRouter>
                <CrearRestaurante />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        // Limpiar los mocks antes de cada test
        jest.clearAllMocks();
        
        // Simular que la inserción de Supabase siempre tiene éxito por defecto
        mockSelect.mockResolvedValue({
            data: [{ id: 99, nombre: 'Restaurante Test' }],
            error: null
        });
        
        // Mockear el alert para evitar errores en JSDOM. 
        // Ya que alert() es una mala práctica, lo reemplazamos.
        window.alert = jest.fn(); 
    });

    /**
     * Test 1: Renderizado y estado inicial
     */
    test('1. Renderiza el formulario con el título correcto', () => {
        renderComponent();
        expect(screen.getByRole('heading', { name: /añadir nuevo restaurante/i })).toBeInTheDocument();
        expect(screen.getByDisplayValue('Morelia')).toBeInTheDocument(); // Valor por defecto
    });

    /**
     * Test 2: Envío exitoso del formulario
     */
    test('2. Envía los datos correctamente a Supabase y navega a dashboard', async () => {
        const user = userEvent.setup();
        renderComponent();

        // 1. Llenar campos obligatorios (nombre, ciudad, dirección, tipo_comida, imagen_url)
        await user.type(screen.getByLabelText(/nombre del restaurante \*/i), 'Test Fast Food');
        await user.type(screen.getByLabelText(/dirección completa \*/i), '123 Fake Street');
        await user.type(screen.getByLabelText(/tipo de comida \*/i), 'Familiar');
        await user.type(screen.getByLabelText(/ruta de imagen \(url\) \*/i), 'url-fake-image.jpg');
        
        // 2. Llenar campos con valores predeterminados o selectores
        await user.selectOptions(screen.getByRole('combobox', { name: /rango de precio/i }), '$$');

        // 3. Simular clic en el botón de guardar
        await user.click(screen.getByRole('button', { name: /guardar restaurante/i }));

        // 4. Esperar a que la inserción se complete
        await waitFor(() => {
            // Verificar que supabase.from.insert fue llamado con los datos correctos
            expect(mockInsert).toHaveBeenCalledWith([
                expect.objectContaining({
                    nombre: 'Test Fast Food',
                    ciudad: 'Morelia',
                    direccion: '123 Fake Street',
                    tipo_comida: 'Familiar',
                    rango_precio: '$$',
                    calificacion_promedio: 0, // Valor inicial del estado
                    imagen_url: 'url-fake-image.jpg',
                    activo: true,
                    id_dueno: null,
                })
            ]);
            
            // Verificar que se mostró el mensaje de éxito (mockeado)
            expect(window.alert).toHaveBeenCalledWith('¡Restaurante creado exitosamente!');
            
            // Verificar que se navegó al dashboard
            expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
        });
    });

    /**
     * Test 3: Manejo de errores de Supabase
     */
    test('3. Muestra alerta y no navega si Supabase devuelve un error', async () => {
        const user = userEvent.setup();
        renderComponent();

        // 1. Configurar el mock para que falle
        mockSelect.mockResolvedValue({
            data: null,
            error: new Error('Error de conexión a BD'),
        });

        // 2. Llenar solo los campos obligatorios para el submit
        await user.type(screen.getByLabelText(/nombre del restaurante \*/i), 'Fallo');
        await user.type(screen.getByLabelText(/dirección completa \*/i), '123 Fail');
        await user.type(screen.getByLabelText(/tipo de comida \*/i), 'Familiar');
        await user.type(screen.getByLabelText(/ruta de imagen \(url\) \*/i), 'url-fake.jpg');

        // 3. Simular clic en guardar
        await user.click(screen.getByRole('button', { name: /guardar restaurante/i }));

        // 4. Esperar el manejo del error
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error al crear el restaurante: Error de conexión a BD');
            // Verificar que la navegación no ocurrió
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
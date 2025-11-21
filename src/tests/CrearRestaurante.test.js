import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CrearRestaurante from '../pages/admin/CrearRestaurante';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock de Supabase - MEJORADO
const mockSelect = jest.fn();
const mockInsert = jest.fn();

jest.mock('../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

// Mock de lucide-react
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div>ArrowLeft Icon</div>,
  Store: () => <div>Store Icon</div>,
  Tag: () => <div>Tag Icon</div>,
  Settings: () => <div>Settings Icon</div>,
  AlertCircle: () => <div>AlertCircle Icon</div>,
}));

describe('CrearRestaurante Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();

    // Configurar el mock para que insert devuelva un objeto con select
    mockInsert.mockReturnValue({
      select: mockSelect,
    });

    // Por defecto, la inserción es exitosa
    mockSelect.mockResolvedValue({
      data: [{ id_restaurante: 99, nombre: 'Restaurante Test' }],
      error: null,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CrearRestaurante />
      </BrowserRouter>
    );
  };

  test('1. Renderiza el formulario con el título correcto', () => {
    renderComponent();
    expect(screen.getByText('Añadir Nuevo Restaurante')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Morelia')).toBeInTheDocument();
  });

  test('2. Envía los datos correctamente a Supabase', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Llenar campos obligatorios
    const nombreInput = screen.getByPlaceholderText(/Ej: Restaurante El Buen Sabor/i);
    await user.clear(nombreInput);
    await user.type(nombreInput, 'Test Restaurant');

    const direccionInput = screen.getByPlaceholderText(/Av. Principal #123/i);
    await user.type(direccionInput, '123 Test Street');

    const tipoComidaInput = screen.getByPlaceholderText(/Ej: Mexicana, Italiana/i);
    await user.type(tipoComidaInput, 'Mexicana');

    const imagenInput = screen.getByPlaceholderText(/images\/restaurantes/i);
    await user.type(imagenInput, 'test-image.jpg');

    // Hacer clic en guardar
    const saveButton = screen.getByRole('button', { name: /Guardar Restaurante/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });

    // Verificaciones
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        nombre: 'Test Restaurant',
        ciudad: 'Morelia',
        direccion: '123 Test Street',
        tipo_comida: 'Mexicana',
        imagen_url: 'test-image.jpg',
        activo: true,
      }),
    ]);

    expect(window.alert).toHaveBeenCalledWith('¡Restaurante creado exitosamente!');
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
  });

  test('3. Maneja errores de Supabase correctamente', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Configurar mock para error
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: 'Error de conexión' },
    });

    // Llenar campos
    const nombreInput = screen.getByPlaceholderText(/Ej: Restaurante El Buen Sabor/i);
    await user.clear(nombreInput);
    await user.type(nombreInput, 'Test');

    const direccionInput = screen.getByPlaceholderText(/Av. Principal #123/i);
    await user.type(direccionInput, '123');

    const tipoComidaInput = screen.getByPlaceholderText(/Ej: Mexicana, Italiana/i);
    await user.type(tipoComidaInput, 'Test');

    const imagenInput = screen.getByPlaceholderText(/images\/restaurantes/i);
    await user.type(imagenInput, 'test.jpg');

    const saveButton = screen.getByRole('button', { name: /Guardar Restaurante/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Error al crear el restaurante')
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
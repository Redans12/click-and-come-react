import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Datos mock
const mockRestaurantes = [
  {
    id_restaurante: 1,
    nombre: "Restaurante Test 1",
    ciudad: "Morelia",
    tipo_comida: "Mexicana",
    rango_precio: "$$",
    imagen_url: "test1.jpg",
    activo: true,
    id_dueno: null,
  },
  {
    id_restaurante: 2,
    nombre: "Restaurante Test 2",
    ciudad: "Morelia",
    tipo_comida: "Italiana",
    rango_precio: "$$$",
    imagen_url: "test2.jpg",
    activo: false,
    id_dueno: 1,
  },
];

const mockUsuarios = [
  {
    id_usuario: 1,
    nombre: "Admin User",
    email: "admin@test.com",
    id_rol: 1,
    esta_bloqueado: false,
  },
  {
    id_usuario: 2,
    nombre: "Cliente User",
    email: "cliente@test.com",
    id_rol: 2,
    esta_bloqueado: false,
  },
];

// Mock de Supabase
jest.mock("../config/supabaseClient", () => ({
  supabase: {
    from: jest.fn((table) => {
      if (table === "usuarios") {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockUsuarios,
              error: null,
            }),
          }),
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        };
      }
      if (table === "restaurantes") {
        return {
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        };
      }
      return {
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
  },
}));

// Mock del servicio de restaurantes
// Mock del servicio de restaurantes
jest.mock("../services/restauranteService", () => ({
  restauranteService: {
    getRestaurantes: jest.fn().mockResolvedValue([
      {
        id_restaurante: 1,
        nombre: "Restaurante Test 1",
        ciudad: "Morelia",
        tipo_comida: "Mexicana",
        rango_precio: "$$",
        imagen_url: "test1.jpg",
        activo: true,
        id_dueno: null,
      },
      {
        id_restaurante: 2,
        nombre: "Restaurante Test 2",
        ciudad: "Morelia",
        tipo_comida: "Italiana",
        rango_precio: "$$$",
        imagen_url: "test2.jpg",
        activo: false,
        id_dueno: 1,
      },
    ]),
  },
}));

// Mock de lucide-react
jest.mock("lucide-react", () => ({
  Users: () => <div>Users Icon</div>,
  Utensils: () => <div>Utensils Icon</div>,
  Calendar: () => <div>Calendar Icon</div>,
  DollarSign: () => <div>DollarSign Icon</div>,
  Plus: () => <div>Plus Icon</div>,
  Search: () => <div>Search Icon</div>,
}));

// Al inicio de src/tests/AdminRestaurante.test.js (o en setupTests.js)
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("AdminDashboard Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  };

  test("1. Renderiza el dashboard con el título correcto", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Panel de Administrador")).toBeInTheDocument();
    });

    expect(screen.getByText("¡Bienvenido, Administrador!")).toBeInTheDocument();
  });

  test("2. Muestra las estadísticas correctamente", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Total Restaurantes")).toBeInTheDocument();
    });

    expect(screen.getByText("Total Usuarios")).toBeInTheDocument();
  });

  test("3. Muestra la lista de restaurantes", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Restaurante Test 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Restaurante Test 2")).toBeInTheDocument();
  });

  test("4. Navega a crear restaurante al hacer clic en Añadir", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /añadir/i })
      ).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /añadir/i });
    addButton.click();
    expect(mockNavigate).toHaveBeenCalledWith("/admin/restaurantes/crear");
  });
});

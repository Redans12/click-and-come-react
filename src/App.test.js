import { render, screen } from '@testing-library/react';
import App from './App';

// Mock de fetch simple para este test (por si acaso setupTests no carga a tiempo)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    headers: { get: () => null },
  })
);

test('Renderiza la aplicación correctamente', () => {
  render(<App />);
  
  // Buscamos algo que sí existe en tu App real, por ejemplo: "Morelia" o "Entrar"
  // Basado en tu log HTML anterior, el texto "Morelia, Michoacán" existe.
  const locationElement = screen.getByText(/Morelia/i);
  
  expect(locationElement).toBeInTheDocument();
});
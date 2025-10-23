import React, { useState } from "react";
import "./Navbar.css";
import { IoChevronDown, IoSearch, IoPeopleOutline } from "react-icons/io5";

const Navbar = ({ onLoginClick }) => {
  const [location] = useState("Morelia, Michoacán");
  const [searchTerm, setSearchTerm] = useState("");
  const [guests] = useState(2);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Selector de ubicación */}
        <div className="location-selector">
          <span>{location}</span>
          <IoChevronDown className="icon-dropdown" />
        </div>

        {/* Barra de búsqueda */}
        <div className="search-bar">
          <button className="search-button">
            <IoSearch />
          </button>
          <input
            type="text"
            placeholder="Buscar restaurante"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Número de personas */}
        <div className="nav-item">
          <IoPeopleOutline className="icon" />
          <span>{guests}</span>
        </div>

        <div className="separator"></div>

        {/* Botón Hoy */}
        <button className="nav-item nav-button">hoy</button>

        <div className="separator"></div>

        {/* Botón Todo el día */}
        <button className="nav-item nav-button">Todo el día</button>

        <div className="separator"></div>

        {/* Botón Entrar */}
        <button className="btn-login" onClick={onLoginClick}>
          Entrar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

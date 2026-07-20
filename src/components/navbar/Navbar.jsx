import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./navbar.css";
import Logo from "../../assets/logo.png";
import PetMenu from "../../assets/PetMenu.png";
import {FaBars, FaTimes,} from "react-icons/fa";
import { navbarPorPerfil } from "./NavbarConfig";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const closeMenu = () => setMenuOpen(false);

  const getLinkClass = ({ isActive }) =>
    isActive ? "navbar-link active" : "navbar-link";

  const perfil = user?.perfil || "visitante";
  const menu = navbarPorPerfil[perfil] || navbarPorPerfil.visitante;

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate("/");
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
        <img src={Logo} alt="Recicla que Pontua" />
      </NavLink>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`navbar-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      />

      <nav className={`navbar-menu ${menuOpen ? "open" : ""}`}>

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={getLinkClass}
              onClick={closeMenu}
            >
              <Icon className="navbar-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {!user && (
          <NavLink
            to="/login"
            className="navbar-button"
            onClick={closeMenu}
          >
            Entrar
          </NavLink>
        )}

      {user && (
      <div className="navbar-user">
        <button
          className="navbar-user-btn"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
         <FaBars />
        </button>

        {userMenuOpen && (
          <div className="navbar-user-menu">

            <NavLink
              to="/perfil"
              onClick={() => {
                setUserMenuOpen(false);
                closeMenu();
              }}
            >
              Meu Perfil
            </NavLink>

            <NavLink
              to="/configuracoes"
              onClick={() => {
                setUserMenuOpen(false);
                closeMenu();
              }}
            >
              Configurações
            </NavLink>

            <NavLink
              to="/notificacoes"
              onClick={() => {
                setUserMenuOpen(false);
                closeMenu();
              }}
            >
              Notificações
            </NavLink>

            <button
              onClick={handleLogout}
            >
              Sair
            </button>

          </div>
        )}
      </div>
    )}

        <img
          src={PetMenu}
          alt="Mascote Recicla que Pontua"
          className="navbar-pet-menu"
        />
      </nav>
    </header>
  );
}
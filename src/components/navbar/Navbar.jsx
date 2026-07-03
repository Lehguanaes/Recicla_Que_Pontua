import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./navbar.css";
import Logo from "../../assets/logo.png";
import PetMenu from "../../assets/PetMenu.png";
import {
  FaBars,
  FaGift,
  FaHome,
  FaRecycle,
  FaTimes,
  FaTrophy,
  FaHandHoldingHeart,
} from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const closeMenu = () => setMenuOpen(false);
  const getLinkClass = ({ isActive }) => isActive ? "navbar-link active" : "navbar-link";

  async function handleLogout() {
      await logout();
      navigate("/");
  }

  return (
    <>
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
          <NavLink to="/" className={getLinkClass} onClick={closeMenu} end>
            <FaHome className="navbar-icon" />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/como-funciona"
            className={getLinkClass}
            onClick={closeMenu}
          >
            <FaRecycle className="navbar-icon" />
            <span>Como funciona</span>
          </NavLink>

          {/* Links para visitantes */}
  {!user && (
    <>
      <NavLink
        to="/ranking"
        className={getLinkClass}
        onClick={closeMenu}
      >
        <FaTrophy className="navbar-icon" />
        <span>Ranking</span>
      </NavLink>

      <NavLink
        to="/recompensas"
        className={getLinkClass}
        onClick={closeMenu}
      >
        <FaGift className="navbar-icon" />
        <span>Recompensas</span>
      </NavLink>

      <NavLink
        to="/login"
        className="navbar-button"
        onClick={closeMenu}
      >
        Entrar
      </NavLink>
    </>
  )}

  {/* Links para usuários logados */}
  {user && (
    <>
      <NavLink
        to="/perfil"
        className={getLinkClass}
        onClick={closeMenu}
      >
        <FaHome className="navbar-icon" />
        <span>Meu Perfil</span>
      </NavLink>

      <NavLink
        to="/doacao/cadastrar-materiais"
        className={getLinkClass}
        onClick={closeMenu}
      >
        <FaHandHoldingHeart className="navbar-icon" />
        <span>Reciclar Materiais</span>
      </NavLink>

      <NavLink
        to="/recompensas"
        className={getLinkClass}
        onClick={closeMenu}
      >
        <FaGift className="navbar-icon" />
        <span>Minhas Recompensas</span>
      </NavLink>

      <button
        className="navbar-button"
        onClick={() => {
          handleLogout();
          closeMenu();
        }}
      >
        Sair
      </button>
    </>
  )}

            <img
            src={PetMenu}
            alt="Mascote Recicla que Pontua"
            className="navbar-pet-menu"
          />
        </nav>
      </header>
    </>
  );
}


//NAVBAR RESPONSIVA VIRANDO SANDUICHE SOMENTE EM TELAS MENORES O DROPDOWM SÓ PARA APARECE PARA ACESSAR O TELA PERFIL, CONSFFIGUAÇÕES E SAIR (LOGOUT)
//em telas menores o dropdown some mantendo da mesma forma que os demais
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../alert/Alert";
import "./navbar.css";
import Logo from "../../assets/logo.png";
import PetMenu from "../../assets/PetMenu.png";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaCog,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { navbarPorPerfil } from "./NavbarConfig";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const closeMenu = () => setMenuOpen(false);

  const getLinkClass = ({ isActive }) =>
    isActive ? "navbar-link active" : "navbar-link";

  const perfil = user?.perfil || "visitante";
  const menu = navbarPorPerfil[perfil] || navbarPorPerfil.visitante;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setLogoutAlertOpen(false);
      closeMenu();
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="navbar">
     <div className="navbar-inner">
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
          aria-label={userMenuOpen ? "Fechar menu do perfil" : "Abrir menu do perfil"}
        >
         <FaUserCircle />
        </button>

        <div className={`navbar-user-menu ${userMenuOpen ? "show" : ""}`}>

          <NavLink
            to="/perfil"
            className={getLinkClass}
            onClick={() => {
              setUserMenuOpen(false);
              closeMenu();
            }}
          >
            <FaUser className="navbar-icon" />
            <span>Meu perfil</span>
          </NavLink>

          <NavLink
            to="/configuracoes"
            className={getLinkClass}
            onClick={() => {
              setUserMenuOpen(false);
              closeMenu();
            }}
          >
            <FaCog className="navbar-icon" />
            <span>Configurações</span>
          </NavLink>

          <NavLink
            to="/notificacoes"
            className={getLinkClass}
            onClick={() => {
              setUserMenuOpen(false);
              closeMenu();
            }}
          >
            <FaBell className="navbar-icon" />
            <span>Notificações</span>
          </NavLink>

          <button
            className="navbar-link navbar-logout-btn"
            onClick={() => {
              setUserMenuOpen(false);
              setLogoutAlertOpen(true);
            }}
          >
            <FaSignOutAlt className="navbar-icon" />
            <span>Sair</span>
          </button>

        </div>
      </div>
    )}

        <img
          src={PetMenu}
          alt="Mascote Recicla que Pontua"
          className="navbar-pet-menu"
        />
      </nav>
     </div>

      <Alert
        isOpen={logoutAlertOpen}
        title="Deseja sair da sua conta?"
        message="Você precisará entrar novamente para acessar seu perfil e acompanhar seus pontos."
        variant="warning"
        confirmText="Sair"
        cancelText="Continuar conectado"
        onConfirm={handleLogout}
        onCancel={() => setLogoutAlertOpen(false)}
        loading={loggingOut}
      />
    </header>
  );
}

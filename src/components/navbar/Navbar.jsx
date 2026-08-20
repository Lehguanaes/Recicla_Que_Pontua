import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../alert/Alert";
import IconButton from "../button/IconButton";
import NotificationBell from "../notifications/NotificationBell";
import "./navbar.css";
import Logo from "../../assets/logo.png";
import PetMenu from "../../assets/PetMenu.png";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { navbarPorPerfil } from "./NavbarConfig";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const closeMenu = () => {
    setMenuOpen(false);
  };

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
    <header className={`navbar ${user ? "navbar-authenticated" : ""}`}>
     <div className="navbar-inner">
      <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
        <img src={Logo} alt="Recicla que Pontua" />
      </NavLink>

      <div className="navbar-top-controls">
        {user && (
          <>
            <NotificationBell userId={user.uid} onOpen={closeMenu} />
            <NavLink
              to="/perfil"
              className="navbar-user-btn"
              onClick={closeMenu}
              aria-label="Acessar meu perfil"
              title="Meu perfil"
            >
              {user?.fotoPerfil ? (
                <img
                  src={user.fotoPerfil}
                  alt={user.nome || "Foto de perfil"}
                  className="navbar-user-avatar"
                />
              ) : (
                <FaUserCircle />
              )}
            </NavLink>
          </>
        )}

      <IconButton
        className="menu-toggle"
        label={menuOpen ? "Fechar menu" : "Abrir menu"}
        pressed={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </IconButton>
      </div>

      <div
        className={`navbar-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      />

      <nav className={`navbar-menu ${menuOpen ? "open" : ""}`}>

        <div className="navbar-links">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={getLinkClass}
                onClick={closeMenu}
              >
                <Icon className="navbar-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {user && (
            <button
              type="button"
              className="navbar-link navbar-logout-btn"
              onClick={() => {
                closeMenu();
                setLogoutAlertOpen(true);
              }}
            >
              <FaSignOutAlt className="navbar-icon" />
              <span>Desconectar</span>
            </button>
          )}
        </div>

        <div className="navbar-actions">
          {!user && (
            <NavLink
              to="/login"
              className="navbar-button"
              onClick={closeMenu}
            >
              Entrar
            </NavLink>
          )}
        </div>

        <img
          src={PetMenu}
          alt="Mascote Recicla que Pontua"
          className="navbar-pet-menu pet-floating"
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

import "./navbar.css";
import Logo from "../../assets/logo-removebg.png";

function Navbar() {
  return (
    <header className="navbar">

      {/* Logo */}
      <a href="/" className="navbar-logo">
        <img src={Logo} alt="Recicla que Pontua" />
      </a>

      {/* Menu */}
      <nav className="navbar-menu">

        <a href="/sobre" className="navbar-link">
          Sobre Nós
        </a>
        <a href="/buscarcatadores" className="navbar-link">
          Buscar Catadores
        </a>
        <a href="/login" className="navbar-button">
          Entrar
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
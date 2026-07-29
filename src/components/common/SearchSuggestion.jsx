import { FaCity, FaMapMarkerAlt } from "react-icons/fa";
import "./SearchBar.css";

export default function SearchSuggestion({
  visible,
  bairroUsuario,
  cidadeUsuario,
  onSelectNeighborhood,
  onSelectCity,
}) {
  if (!visible || (!bairroUsuario && !cidadeUsuario)) return null;

  return (
    <div className="search-suggestions" aria-label="Locais do seu perfil">
      <p className="search-suggestion-title">Locais do seu perfil</p>

      {bairroUsuario && (
        <button
          type="button"
          className="search-suggestion"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onSelectNeighborhood}
          aria-label={`Buscar no bairro ${bairroUsuario}`}
        >
          <FaMapMarkerAlt aria-hidden="true" />
          <span>
            <strong>Bairro</strong>
            <small>{bairroUsuario}</small>
          </span>
        </button>
      )}

      {cidadeUsuario && (
        <button
          type="button"
          className="search-suggestion"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onSelectCity}
          aria-label={`Buscar na cidade ${cidadeUsuario}`}
        >
          <FaCity aria-hidden="true" />
          <span>
            <strong>Cidade</strong>
            <small>{cidadeUsuario}</small>
          </span>
        </button>
      )}
    </div>
  );
}

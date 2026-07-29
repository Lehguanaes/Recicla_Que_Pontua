import { useState } from "react";
import SearchSuggestion from "./SearchSuggestion";
import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Bairro ou cidade",
  loading = false,
  aviso = null,
  localAtivo = false,
  bairroUsuario = "",
  cidadeUsuario = "",
}) {
  const [mostrarSugestao, setMostrarSugestao] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch?.();
    }
  };

  const handleChange = (event) => {
    const novoValor = event.target.value;

    onChange(novoValor);

    if (bairroUsuario || cidadeUsuario) {
      setMostrarSugestao(true);
    }
  };

  const handleFocus = () => {
    if (bairroUsuario || cidadeUsuario) {
      setMostrarSugestao(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setMostrarSugestao(false), 150);
  };

  const usarBairroCadastrado = () => {
    onChange([bairroUsuario, cidadeUsuario].filter(Boolean).join(", "));
    setMostrarSugestao(false);
  };

  const usarCidadeCadastrada = () => {
    onChange(cidadeUsuario);
    setMostrarSugestao(false);
  };

  return (
    <div className="search-bar-wrapper">

      <div className="search-bar-row">

        <div className="search-bar-input-wrapper">

          <input
            className="search-bar-input"
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />

          {value && (
            <button
              type="button"
              className="search-bar-clear"
              onClick={onClear}
            >
              ×
            </button>
          )}

          <SearchSuggestion
            visible={mostrarSugestao}
            bairroUsuario={bairroUsuario}
            cidadeUsuario={cidadeUsuario}
            onSelectNeighborhood={usarBairroCadastrado}
            onSelectCity={usarCidadeCadastrada}
          />

        </div>

        <button
          type="button"
          className="search-bar-submit"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

      </div>

      {aviso && (
        <p className={`search-bar-notice ${localAtivo ? "active" : ""}`}>
          {aviso}
        </p>
      )}

    </div>
  );
}

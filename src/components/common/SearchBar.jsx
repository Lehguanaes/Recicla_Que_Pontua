import { useState } from "react";
import Button from "./Button";
import SearchSuggestion from "./SearchSuggestion";
import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Seu local (rua, bairro ou cidade)",
  loading = false,
  aviso = null,
  localAtivo = false,
  enderecoUsuario = null,
  onUseCurrentLocation = null,
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

    if (enderecoUsuario) {
      setMostrarSugestao(novoValor.trim() === "");
    }
  };

  const handleFocus = () => {
    if (enderecoUsuario && value.trim() === "") {
      setMostrarSugestao(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setMostrarSugestao(false), 150);
  };

  const usarEnderecoCadastrado = () => {
    onChange(enderecoUsuario);
    setMostrarSugestao(false);
    onSearch?.();
  };

  const usarLocalizacaoAtual = () => {
    setMostrarSugestao(false);
    onUseCurrentLocation?.();
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
            enderecoUsuario={enderecoUsuario}
            onUseCurrentLocation={usarLocalizacaoAtual}
            onUseHomeAddress={usarEnderecoCadastrado}
          />

        </div>

        <Button
          className="search-bar-submit"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>

      </div>

      {aviso && (
        <p className={`search-bar-notice ${localAtivo ? "active" : ""}`}>
          {aviso}
        </p>
      )}

    </div>
  );
}
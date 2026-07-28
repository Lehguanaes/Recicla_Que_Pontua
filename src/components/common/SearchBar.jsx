import { useState } from "react";

import { COLORS } from "../../constants";
import Button from "./Button";
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
}) {
  const [mostrarSugestao, setMostrarSugestao] = useState(false);

  const podeSugerirEndereco = (campoVazio) =>
    Boolean(enderecoUsuario && campoVazio);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch?.();
    }
  };

  const handleChange = (event) => {
    const novoValor = event.target.value;
    onChange(novoValor);
    setMostrarSugestao(podeSugerirEndereco(!novoValor));
  };

  const handleFocus = () => {
    setMostrarSugestao(podeSugerirEndereco(!value));
  };

  const handleAddressSuggestion = () => {
    onChange(enderecoUsuario);
    setMostrarSugestao(false);
    onSearch?.();
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-row">
        <div className="search-bar-input-wrapper">
          <input
            className="search-bar-input"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Buscar endereço"
          />

          {value && (
            <button
              type="button"
              className="search-bar-clear"
              onClick={onClear}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}

          {mostrarSugestao && (
            <button
              type="button"
              className="search-bar-suggestion"
              onClick={handleAddressSuggestion}
            >
              Usar meu endereço: {enderecoUsuario}
            </button>
          )}
        </div>

        <Button
          onClick={onSearch}
          disabled={loading}
          loading={loading}
          className="search-bar-submit"
          style={{ background: COLORS.verdeEscuro, border: COLORS.verdeEscuro, color: COLORS.white }}
        >
          Buscar
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

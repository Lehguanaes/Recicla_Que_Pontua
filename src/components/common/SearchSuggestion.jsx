import {
    FaHome,
    FaHistory,
    FaLocationArrow
} from "react-icons/fa";

export default function SearchSuggestions({
    visible,
    enderecoUsuario,
    enderecosRecentes = [],
    onUseCurrentLocation,
    onUseHomeAddress,
    onSelectRecent,
}) {

    if (!visible) return null;

    return (
        <div className="search-suggestions">

            {/* Localização atual */}
            <button
                className="search-suggestion"
                onClick={onUseCurrentLocation}
            >
                <FaLocationArrow />
                <div>
                    <strong>Minha localização atual</strong>
                    <span>Usar GPS do dispositivo</span>
                </div>
            </button>

            {/* Endereço cadastrado */}
            {enderecoUsuario && (
                <button
                    className="search-suggestion"
                    onClick={onUseHomeAddress}
                >
                    <FaHome />
                    <div>
                        <strong>Meu endereço cadastrado</strong>
                        <span>{enderecoUsuario}</span>
                    </div>
                </button>
            )}

            {/* Recentes */}
            {enderecosRecentes.length > 0 && (
                <>
                    <div className="search-suggestion-title">
                        Recentes
                    </div>

                    {enderecosRecentes.map((endereco) => (
                        <button
                            key={endereco}
                            className="search-suggestion"
                            onClick={() => onSelectRecent(endereco)}
                        >
                            <FaHistory />

                            <span>{endereco}</span>
                        </button>
                    ))}
                </>
            )}

        </div>
    );
}
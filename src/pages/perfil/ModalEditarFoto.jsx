import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Modal from "../../components/modal/Modal";

const TAMANHO_MAXIMO_MB = 2;

export default function ModalEditarFoto({
  isOpen,
  onClose,
  fotoAtual,
  onSalvar,
  onSalvo,
}) {
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreview(fotoAtual || null);
      setErro("");
    }
  }, [isOpen, fotoAtual]);

  if (!isOpen) return null;

  function handleArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem válido.");
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
      setErro(`A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB}MB.`);
      return;
    }

    setErro("");

    const leitor = new FileReader();
    leitor.onload = () => setPreview(leitor.result);
    leitor.onerror = () => setErro("Não foi possível ler a imagem.");
    leitor.readAsDataURL(arquivo);
  }

  async function handleSalvar() {
    setSalvando(true);
    setErro("");

    try {
      await onSalvar({ fotoPerfil: preview || null });
      onSalvo({ fotoPerfil: preview || null });
      onClose();
    } catch (err) {
      console.error("Erro ao salvar foto de perfil:", err);
      setErro("Não foi possível salvar sua foto. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function handleRemover() {
    setPreview(null);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="perfil-modal-titulo">Foto de perfil</h2>
      <p className="perfil-modal-subtitulo">
        Escolha uma imagem para personalizar seu perfil.
      </p>

      <div className="perfil-foto-preview-wrapper">
        {preview ? (
          <img src={preview} alt="Pré-visualização" className="perfil-foto-preview" />
        ) : (
          <FaUserCircle className="perfil-avatar-placeholder grande" />
        )}
      </div>

      <div className="perfil-foto-acoes-arquivo">
        <label className="perfil-botao-secundario perfil-input-arquivo-label">
          Escolher imagem
          <input
            type="file"
            accept="image/*"
            onChange={handleArquivo}
            className="perfil-input-arquivo"
          />
        </label>

        {preview && (
          <button
            type="button"
            className="perfil-link-remover"
            onClick={handleRemover}
          >
            Remover foto
          </button>
        )}
      </div>

      {erro && <p className="perfil-form-error">{erro}</p>}

      <div className="perfil-modal-acoes">
        <button
          type="button"
          className="perfil-botao-secundario"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="perfil-botao-primario"
          onClick={handleSalvar}
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar foto"}
        </button>
      </div>
    </Modal>
  );
}

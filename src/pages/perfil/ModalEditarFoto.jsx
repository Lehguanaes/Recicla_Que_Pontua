import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import Alert from "../../components/alert/Alert";
import FormActions from "../../components/form/FormActions";

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
  const [removeAlertOpen, setRemoveAlertOpen] = useState(false);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreview(fotoAtual || null);
      setErro("");
      setRemoveAlertOpen(false);
      setSaveAlertOpen(false);
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
      setErro(`A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB} MB.`);
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
      setSaveAlertOpen(false);
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
    setRemoveAlertOpen(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="perfil-modal">
      <ModalHeader
        title="Foto de Perfil"
        subtitle="Escolha uma imagem para personalizar seu perfil."
        titleClassName="perfil-modal-titulo"
        subtitleClassName="perfil-modal-subtitulo"
      />

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
            onClick={() => setRemoveAlertOpen(true)}
          >
            Remover foto
          </button>
        )}
      </div>

      {erro && <p className="perfil-form-error">{erro}</p>}

      <FormActions
        className="perfil-modal-acoes"
        cancelClassName="perfil-botao-secundario"
        confirmClassName="perfil-botao-primario"
        confirmText="Salvar foto"
        confirmType="button"
        loading={salvando}
        onCancel={onClose}
        onConfirm={() => setSaveAlertOpen(true)}
      />

      <Alert
        isOpen={removeAlertOpen}
        title="Remover foto de perfil?"
        message="A foto será removida da pré-visualização. Para concluir a alteração, salve o formulário."
        variant="danger"
        confirmText="Remover foto"
        cancelText="Manter foto"
        onConfirm={handleRemover}
        onCancel={() => setRemoveAlertOpen(false)}
      />

      <Alert
        isOpen={saveAlertOpen}
        title="Confirmar alteração da foto?"
        message={preview ? "A imagem exibida será usada como sua nova foto de perfil." : "Seu perfil ficará sem uma foto personalizada."}
        variant="info"
        confirmText="Salvar foto"
        cancelText="Revisar"
        onConfirm={handleSalvar}
        onCancel={() => setSaveAlertOpen(false)}
        loading={salvando}
      />
    </Modal>
  );
}

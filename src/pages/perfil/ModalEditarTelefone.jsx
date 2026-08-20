import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import Alert from "../../components/alert/Alert";
import InputField from "../../components/form/InputField";
import FormActions from "../../components/form/FormActions";
import FormMessage from "../../components/form/FormMessage";
import { maskTelefone } from "../../utils/Formatters";
import { validarCampos } from "../../utils/AuthValidation";

const camposTelefone = [{ name: "telefone", required: true }];

export default function ModalEditarTelefone({
  isOpen,
  onClose,
  telefoneAtual,
  onSalvar,
  onSalvo,
}) {
  const [telefone, setTelefone] = useState("");
  const [errors, setErrors] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTelefone(telefoneAtual || "");
      setErrors({});
      setConfirmOpen(false);
    }
  }, [isOpen, telefoneAtual]);

  if (!isOpen) return null;

  function handleChange(rawValue) {
    setTelefone(maskTelefone(rawValue));
    setErrors((prev) => ({ ...prev, telefone: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validarCampos(camposTelefone, { telefone });
    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;
    setConfirmOpen(true);
  }

  async function handleConfirmSave() {
    setSalvando(true);

    try {
      await onSalvar({ telefone });
      onSalvo({ telefone });
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar telefone:", err);
      setErrors((prev) => ({
        ...prev,
        geral: "Não foi possível salvar seu telefone. Tente novamente.",
      }));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="perfil-modal">
      <ModalHeader
        title="Editar Telefone"
        subtitle="Mantenha seu telefone atualizado para facilitar o contato."
        titleClassName="perfil-modal-titulo"
        subtitleClassName="perfil-modal-subtitulo"
      />

      <form className="perfil-form" onSubmit={handleSubmit} noValidate>
        <InputField
          id="telefone"
          label="Telefone"
          fieldClassName="perfil-input-group full"
          error={errors.telefone}
          errorClassName="perfil-form-error"
          type="tel"
          inputMode="numeric"
          placeholder="(00) 00000-0000"
          value={telefone}
          onChange={(e) => handleChange(e.target.value)}
        />

        <FormMessage className="perfil-form-error">
          {errors.geral}
        </FormMessage>

        <FormActions
          className="perfil-modal-acoes"
          cancelClassName="perfil-botao-secundario"
          confirmClassName="perfil-botao-primario"
          confirmText="Salvar telefone"
          loading={salvando}
          onCancel={onClose}
        />
      </form>

      <Alert
        isOpen={confirmOpen}
        title="Confirmar novo telefone?"
        message={`O telefone do perfil será atualizado para ${telefone}.`}
        variant="info"
        confirmText="Salvar telefone"
        cancelText="Revisar"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
        loading={salvando}
      />
    </Modal>
  );
}

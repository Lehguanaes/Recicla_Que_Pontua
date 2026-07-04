import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
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

  useEffect(() => {
    if (isOpen) {
      setTelefone(telefoneAtual || "");
      setErrors({});
    }
  }, [isOpen, telefoneAtual]);

  if (!isOpen) return null;

  function handleChange(rawValue) {
    setTelefone(maskTelefone(rawValue));
    setErrors((prev) => ({ ...prev, telefone: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validarCampos(camposTelefone, { telefone });
    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    setSalvando(true);

    try {
      await onSalvar({ telefone });
      onSalvo({ telefone });
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="perfil-modal-titulo">Editar telefone</h2>
      <p className="perfil-modal-subtitulo">
        Mantenha seu telefone atualizado para facilitar o contato.
      </p>

      <form className="perfil-form" onSubmit={handleSubmit} noValidate>
        <div className="perfil-input-group full">
          <label htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            type="tel"
            inputMode="numeric"
            placeholder="(00) 00000-0000"
            value={telefone}
            className={errors.telefone ? "error" : ""}
            onChange={(e) => handleChange(e.target.value)}
          />
          {errors.telefone && (
            <span className="perfil-form-error">{errors.telefone}</span>
          )}
        </div>

        {errors.geral && <p className="perfil-form-error">{errors.geral}</p>}

        <div className="perfil-modal-acoes">
          <button
            type="button"
            className="perfil-botao-secundario"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="perfil-botao-primario"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar telefone"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

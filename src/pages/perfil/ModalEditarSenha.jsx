import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import PasswordInput from "../../components/form/PasswordInput";
import FormField from "../../components/form/FormField";
import InputField from "../../components/form/InputField";
import FormActions from "../../components/form/FormActions";
import Alert from "../../components/alert/Alert";
import { auth } from "../../services/Firebase";

export default function ModalEditarSenha({ isOpen, onClose }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setErrors({});
      setSucesso(false);
      setConfirmOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function validar() {
    const novosErros = {};

    if (!senhaAtual) {
      novosErros.senhaAtual = "Informe sua senha atual.";
    }

    if (!novaSenha) {
      novosErros.novaSenha = "Campo obrigatório.";
    } else if (novaSenha.length < 6) {
      novosErros.novaSenha = "A senha deve possuir pelo menos 6 caracteres.";
    }

    if (!confirmarSenha) {
      novosErros.confirmarSenha = "Campo obrigatório.";
    } else if (novaSenha !== confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    return novosErros;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validar();
    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    const usuario = auth.currentUser;

    if (!usuario) {
      setErrors({ geral: "Sessão expirada. Faça login novamente." });
      return;
    }

    setConfirmOpen(true);
  }

  async function handleConfirmSave() {
    const usuario = auth.currentUser;
    if (!usuario) {
      setConfirmOpen(false);
      setErrors({ geral: "Sessão expirada. Faça login novamente." });
      return;
    }

    setSalvando(true);

    try {
      const credencial = EmailAuthProvider.credential(
        usuario.email,
        senhaAtual
      );

      await reauthenticateWithCredential(usuario, credencial);
      await updatePassword(usuario, novaSenha);

      setConfirmOpen(false);
      setSucesso(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrors({ senhaAtual: "Senha atual incorreta." });
          break;

        case "auth/too-many-requests":
          setErrors({
            geral: "Muitas tentativas. Aguarde um momento e tente novamente.",
          });
          break;

        case "auth/weak-password":
          setErrors({
            novaSenha: "A senha deve possuir pelo menos 6 caracteres.",
          });
          break;

        default:
          setErrors({ geral: "Não foi possível alterar sua senha." });
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="perfil-modal">
      <ModalHeader
        title="Alterar senha"
        subtitle="Por segurança, informe sua senha atual antes de definir uma nova."
        titleClassName="perfil-modal-titulo"
        subtitleClassName="perfil-modal-subtitulo"
      />

      {sucesso ? (
        <div className="perfil-sucesso">
          <p>Sua senha foi alterada com sucesso!</p>
          <FormActions
            className="perfil-modal-acoes"
            confirmClassName="perfil-botao-primario"
            confirmText="Fechar"
            confirmType="button"
            onConfirm={onClose}
          />
        </div>
      ) : (
        <form className="perfil-form" onSubmit={handleSubmit} noValidate>
          <FormField
            id="senhaAtual"
            label="Senha atual"
            className="perfil-input-group full"
            error={errors.senhaAtual}
            errorClassName="perfil-form-error"
          >
            <PasswordInput
              visible={mostrarSenha}
              onToggle={() => setMostrarSenha((prev) => !prev)}
              containerClassName="perfil-input-senha"
              buttonClassName="perfil-mostrar-senha"
              inputProps={{
                id: "senhaAtual",
                placeholder: "Senha atual",
                value: senhaAtual,
                invalid: Boolean(errors.senhaAtual),
                onChange: (e) => {
                  setSenhaAtual(e.target.value);
                  setErrors((prev) => ({ ...prev, senhaAtual: undefined }));
                },
              }}
            />
          </FormField>

          <InputField
            id="novaSenha"
            label="Nova senha"
            fieldClassName="perfil-input-group full"
            error={errors.novaSenha}
            errorClassName="perfil-form-error"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Mínimo de 6 caracteres"
            value={novaSenha}
            onChange={(e) => {
              setNovaSenha(e.target.value);
              setErrors((prev) => ({ ...prev, novaSenha: undefined }));
            }}
          />

          <InputField
            id="confirmarSenha"
            label="Confirmar nova senha"
            fieldClassName="perfil-input-group full"
            error={errors.confirmarSenha}
            errorClassName="perfil-form-error"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Repita a nova senha"
            value={confirmarSenha}
            onChange={(e) => {
              setConfirmarSenha(e.target.value);
              setErrors((prev) => ({
                ...prev,
                confirmarSenha: undefined,
              }));
            }}
          />

          {errors.geral && (
            <p className="perfil-form-error">{errors.geral}</p>
          )}

          <FormActions
            className="perfil-modal-acoes"
            cancelClassName="perfil-botao-secundario"
            confirmClassName="perfil-botao-primario"
            confirmText="Alterar senha"
            loading={salvando}
            onCancel={onClose}
          />
        </form>
      )}

      <Alert
        isOpen={confirmOpen}
        title="Confirmar alteração de senha?"
        message="Sua senha atual deixará de funcionar assim que a alteração for concluída."
        variant="warning"
        confirmText="Alterar Senha"
        cancelText="Revisar"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
        loading={salvando}
      />
    </Modal>
  );
}

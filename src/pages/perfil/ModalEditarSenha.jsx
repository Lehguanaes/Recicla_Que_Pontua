import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import Modal from "../../components/modal/Modal";
import { auth } from "../../services/Firebase";

export default function ModalEditarSenha({ isOpen, onClose }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setErrors({});
      setSucesso(false);
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

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validar();
    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    const usuario = auth.currentUser;

    if (!usuario) {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="perfil-modal-titulo">Alterar senha</h2>
      <p className="perfil-modal-subtitulo">
        Por segurança, informe sua senha atual antes de definir uma nova.
      </p>

      {sucesso ? (
        <div className="perfil-sucesso">
          <p>Sua senha foi alterada com sucesso!</p>
          <div className="perfil-modal-acoes">
            <button
              type="button"
              className="perfil-botao-primario"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      ) : (
        <form className="perfil-form" onSubmit={handleSubmit} noValidate>
          <div className="perfil-input-group full">
            <label htmlFor="senhaAtual">Senha atual</label>
            <div className="perfil-input-senha">
              <input
                id="senhaAtual"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha atual"
                value={senhaAtual}
                className={errors.senhaAtual ? "error" : ""}
                onChange={(e) => {
                  setSenhaAtual(e.target.value);
                  setErrors((prev) => ({ ...prev, senhaAtual: undefined }));
                }}
              />
              <button
                type="button"
                className="perfil-mostrar-senha"
                onClick={() => setMostrarSenha((prev) => !prev)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.senhaAtual && (
              <span className="perfil-form-error">{errors.senhaAtual}</span>
            )}
          </div>

          <div className="perfil-input-group full">
            <label htmlFor="novaSenha">Nova senha</label>
            <input
              id="novaSenha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Mínimo de 6 caracteres"
              value={novaSenha}
              className={errors.novaSenha ? "error" : ""}
              onChange={(e) => {
                setNovaSenha(e.target.value);
                setErrors((prev) => ({ ...prev, novaSenha: undefined }));
              }}
            />
            {errors.novaSenha && (
              <span className="perfil-form-error">{errors.novaSenha}</span>
            )}
          </div>

          <div className="perfil-input-group full">
            <label htmlFor="confirmarSenha">Confirmar nova senha</label>
            <input
              id="confirmarSenha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              className={errors.confirmarSenha ? "error" : ""}
              onChange={(e) => {
                setConfirmarSenha(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  confirmarSenha: undefined,
                }));
              }}
            />
            {errors.confirmarSenha && (
              <span className="perfil-form-error">
                {errors.confirmarSenha}
              </span>
            )}
          </div>

          {errors.geral && (
            <p className="perfil-form-error">{errors.geral}</p>
          )}

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
              {salvando ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

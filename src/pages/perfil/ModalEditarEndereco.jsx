import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import { maskCEP } from "../../utils/Formatters";
import { validarCampos } from "../../utils/AuthValidation";

const camposEndereco = [
  { name: "cep", required: true },
  { name: "rua", required: true },
  { name: "numero", required: true },
  { name: "bairro", required: true },
  { name: "cidade", required: true },
  { name: "estado", required: true },
];

export default function ModalEditarEndereco({
  isOpen,
  onClose,
  dadosAtuais,
  onSalvar,
  onSalvo,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Preenche o formulário com os dados já existentes sempre que o modal é aberto.
  // No Firestore só o CEP é salvo separado; o restante fica dentro de "endereco".
  useEffect(() => {
    if (isOpen) {
      const endereco = dadosAtuais?.endereco || {};

      setFormData({
        cep: dadosAtuais?.cep || "",
        rua: endereco.rua || "",
        numero: endereco.numero || "",
        complemento: endereco.complemento || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || dadosAtuais?.cidade || "",
        estado: endereco.estado || dadosAtuais?.estado || "",
      });
      setErrors({});
    }
  }, [isOpen, dadosAtuais]);

  if (!isOpen) return null;

  function handleChange(name, rawValue) {
    const valor = name === "cep" ? maskCEP(rawValue) : rawValue;

    setFormData((prev) => ({ ...prev, [name]: valor }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // Busca o endereço automaticamente a partir do CEP para agilizar o preenchimento
  async function handleCepBlur() {
    const cepLimpo = (formData.cep || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setBuscandoCep(true);

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const dados = await resposta.json();

      if (!dados.erro) {
        setFormData((prev) => ({
          ...prev,
          rua: dados.logradouro || prev.rua,
          bairro: dados.bairro || prev.bairro,
          cidade: dados.localidade || prev.cidade,
          estado: dados.uf || prev.estado,
        }));
      }
    } catch (err) {
      // Falha na busca não deve impedir o preenchimento manual
      console.error("Não foi possível buscar o CEP automaticamente:", err);
    } finally {
      setBuscandoCep(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validarCampos(camposEndereco, formData);
    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    setSalvando(true);

    // Só o CEP é salvo como campo separado; rua, número, complemento,
    // bairro, cidade e estado ficam agrupados em um único campo "endereco".
    const payload = {
      cep: formData.cep,
      endereco: {
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento || "",
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
      },
    };

    try {
      await onSalvar(payload);
      onSalvo(payload);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      setErrors((prev) => ({
        ...prev,
        geral: "Não foi possível salvar seu endereço. Tente novamente.",
      }));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="perfil-modal-titulo">Endereço completo</h2>
      <p className="perfil-modal-subtitulo">
        Essas informações são opcionais e ajudam a melhorar a filtragem de
        catadores e centros de coleta próximos a você.
      </p>

      <form className="perfil-form" onSubmit={handleSubmit} noValidate>
        <div className="perfil-form-grid">
          <div className="perfil-input-group small">
            <label htmlFor="cep">CEP</label>
            <input
              id="cep"
              type="text"
              inputMode="numeric"
              placeholder="00000-000"
              value={formData.cep || ""}
              className={errors.cep ? "error" : ""}
              onChange={(e) => handleChange("cep", e.target.value)}
              onBlur={handleCepBlur}
            />
            {buscandoCep && (
              <span className="perfil-form-hint">Buscando endereço...</span>
            )}
            {errors.cep && <span className="perfil-form-error">{errors.cep}</span>}
          </div>

          <div className="perfil-input-group full">
            <label htmlFor="rua">Rua / Logradouro</label>
            <input
              id="rua"
              type="text"
              placeholder="Rua / Avenida"
              value={formData.rua || ""}
              className={errors.rua ? "error" : ""}
              onChange={(e) => handleChange("rua", e.target.value)}
            />
            {errors.rua && <span className="perfil-form-error">{errors.rua}</span>}
          </div>

          <div className="perfil-input-group small">
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              type="text"
              placeholder="Número"
              value={formData.numero || ""}
              className={errors.numero ? "error" : ""}
              onChange={(e) => handleChange("numero", e.target.value)}
            />
            {errors.numero && (
              <span className="perfil-form-error">{errors.numero}</span>
            )}
          </div>

          <div className="perfil-input-group small">
            <label htmlFor="complemento">Complemento</label>
            <input
              id="complemento"
              type="text"
              placeholder="Apto, bloco... (opcional)"
              value={formData.complemento || ""}
              onChange={(e) => handleChange("complemento", e.target.value)}
            />
          </div>

          <div className="perfil-input-group full">
            <label htmlFor="bairro">Bairro</label>
            <input
              id="bairro"
              type="text"
              placeholder="Bairro"
              value={formData.bairro || ""}
              className={errors.bairro ? "error" : ""}
              onChange={(e) => handleChange("bairro", e.target.value)}
            />
            {errors.bairro && (
              <span className="perfil-form-error">{errors.bairro}</span>
            )}
          </div>

          <div className="perfil-input-group small">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              type="text"
              placeholder="Cidade"
              value={formData.cidade || ""}
              className={errors.cidade ? "error" : ""}
              onChange={(e) => handleChange("cidade", e.target.value)}
            />
            {errors.cidade && (
              <span className="perfil-form-error">{errors.cidade}</span>
            )}
          </div>

          <div className="perfil-input-group small">
            <label htmlFor="estado">Estado</label>
            <input
              id="estado"
              type="text"
              placeholder="Estado"
              value={formData.estado || ""}
              className={errors.estado ? "error" : ""}
              onChange={(e) => handleChange("estado", e.target.value)}
            />
            {errors.estado && (
              <span className="perfil-form-error">{errors.estado}</span>
            )}
          </div>
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
            {salvando ? "Salvando..." : "Salvar endereço"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

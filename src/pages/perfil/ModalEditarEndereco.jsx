import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import Alert from "../../components/alert/Alert";
import InputField from "../../components/form/InputField";
import FormActions from "../../components/form/FormActions";
import FormMessage from "../../components/form/FormMessage";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      setConfirmOpen(false);
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

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validarCampos(camposEndereco, formData);
    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;
    setConfirmOpen(true);
  }

  async function handleConfirmSave() {
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
      setConfirmOpen(false);
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

  const camposFormulario = [
    {
      name: "cep",
      label: "CEP",
      fieldClassName: "perfil-input-group small",
      inputMode: "numeric",
      placeholder: "00000-000",
      hint: buscandoCep ? "Buscando endereço..." : "",
      hintClassName: "perfil-form-hint",
      onBlur: handleCepBlur,
    },
    {
      name: "rua",
      label: "Rua / Logradouro",
      fieldClassName: "perfil-input-group",
      placeholder: "Rua / Avenida",
    },
    {
      name: "numero",
      label: "Número",
      fieldClassName: "perfil-input-group small",
      placeholder: "Número",
    },
    {
      name: "complemento",
      label: "Complemento",
      fieldClassName: "perfil-input-group small",
      placeholder: "Apto, bloco... (opcional)",
    },
    {
      name: "bairro",
      label: "Bairro",
      fieldClassName: "perfil-input-group full",
      placeholder: "Bairro",
    },
    {
      name: "cidade",
      label: "Cidade",
      fieldClassName: "perfil-input-group small",
      placeholder: "Cidade",
    },
    {
      name: "estado",
      label: "Estado",
      fieldClassName: "perfil-input-group small",
      placeholder: "Estado",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="perfil-modal perfil-modal-amplo"
    >
      <ModalHeader
        title="Endereço Completo"
        subtitle="Essas informações são opcionais e ajudam a melhorar a filtragem de coletores e centros de coleta próximos a você."
        titleClassName="perfil-modal-titulo"
        subtitleClassName="perfil-modal-subtitulo"
      />

      <form className="perfil-form" onSubmit={handleSubmit} noValidate>
        <div className="perfil-form-grid">
          {camposFormulario.map(({ name, ...campo }) => (
            <InputField
              key={name}
              id={name}
              type="text"
              error={errors[name]}
              errorClassName="perfil-form-error"
              value={formData[name] || ""}
              onChange={(event) => handleChange(name, event.target.value)}
              {...campo}
            />
          ))}
        </div>

        <FormMessage className="perfil-form-error">
          {errors.geral}
        </FormMessage>

        <FormActions
          className="perfil-modal-acoes"
          cancelClassName="perfil-botao-secundario"
          confirmClassName="perfil-botao-primario"
          confirmText="Salvar endereço"
          loading={salvando}
          onCancel={onClose}
        />
      </form>

      <Alert
        isOpen={confirmOpen}
        title="Confirmar endereço?"
        message={`${formData.rua}, ${formData.numero} — ${formData.cidade}/${formData.estado}.`}
        variant="info"
        confirmText="Salvar endereço"
        cancelText="Revisar"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
        loading={salvando}
      />
    </Modal>
  );
}

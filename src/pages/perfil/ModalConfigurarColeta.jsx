import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import Alert from "../../components/alert/Alert";
import FormField from "../../components/form/FormField";
import FormActions from "../../components/form/FormActions";
import FormMessage from "../../components/form/FormMessage";
import SelectField from "../../components/form/SelectField";
import {
  normalizeMaterialId,
  RECYCLABLE_MATERIALS,
} from "../../constants";

export const tiposVeiculo = [
  { value: "bicicleta", label: "Bicicleta" },
  { value: "moto", label: "Moto" },
  { value: "carro", label: "Carro" },
  { value: "utilitario", label: "Utilitário" },
  { value: "caminhao", label: "Caminhão" },
];

export default function ModalConfigurarColeta({
  isOpen,
  onClose,
  dadosAtuais,
  onSalvar,
  onSalvo,
}) {
  const [materiais, setMateriais] = useState([]);
  const [possuiVeiculo, setPossuiVeiculo] = useState(null); // true | false | null
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const materiaisPermitidos = new Set(
        RECYCLABLE_MATERIALS.map((material) => material.value)
      );
      setMateriais(
        (dadosAtuais?.materiaisAceitos || [])
          .map(normalizeMaterialId)
          .filter((material) => materiaisPermitidos.has(material))
      );
      setPossuiVeiculo(
        typeof dadosAtuais?.possuiVeiculo === "boolean"
          ? dadosAtuais.possuiVeiculo
          : null
      );
      setTipoVeiculo(dadosAtuais?.tipoVeiculo || "");
      setErro("");
      setConfirmOpen(false);
    }
  }, [isOpen, dadosAtuais]);

  if (!isOpen) return null;

  function alternarMaterial(value) {
    setMateriais((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setErro("");
  }

  function handlePossuiVeiculo(valor) {
    setPossuiVeiculo(valor);
    if (!valor) setTipoVeiculo("");
    setErro("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (materiais.length === 0) {
      setErro("Selecione ao menos um material que você recebe.");
      return;
    }

    if (possuiVeiculo === null) {
      setErro("Informe se você possui veículo para realizar coletas.");
      return;
    }

    if (possuiVeiculo && !tipoVeiculo) {
      setErro("Selecione o tipo de veículo.");
      return;
    }

    setConfirmOpen(true);
  }

  async function handleConfirmSave() {
    setSalvando(true);
    const payload = {
      materiaisAceitos: materiais,
      possuiVeiculo,
      tipoVeiculo: possuiVeiculo ? tipoVeiculo : "",
    };

    try {
      await onSalvar(payload);
      onSalvo(payload);
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar informações de coleta:", err);
      setErro("Não foi possível salvar suas informações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="perfil-modal perfil-modal-amplo"
    >
      <ModalHeader
        title="Configurar coleta"
        titleClassName="perfil-modal-titulo"
      />
   
      <form className="perfil-form" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Materiais que você recebe"
          className="perfil-input-group full"
        >
          <div className="perfil-checkbox-grid">
            {RECYCLABLE_MATERIALS.map((material) => (
              <label
                key={material.value}
                className="perfil-checkbox-item"
              >
                <input
                  type="checkbox"
                  checked={materiais.includes(material.value)}
                  onChange={() => alternarMaterial(material.value)}
                />
                {material.label}
              </label>
            ))}
          </div>
        </FormField>

        <FormField
          label="Possui veículo?"
          className="perfil-input-group full"
        >
          <div className="perfil-radio-group">
            <label className="perfil-radio-item">
              <input
                type="radio"
                name="possuiVeiculo"
                checked={possuiVeiculo === true}
                onChange={() => handlePossuiVeiculo(true)}
              />
              Sim
            </label>
            <label className="perfil-radio-item">
              <input
                type="radio"
                name="possuiVeiculo"
                checked={possuiVeiculo === false}
                onChange={() => handlePossuiVeiculo(false)}
              />
              Não
            </label>
          </div>
        </FormField>

        {possuiVeiculo && (
          <FormField
            id="tipoVeiculo"
            label="Tipo de veículo"
            className="perfil-input-group full"
          >
            <SelectField
              native
              id="tipoVeiculo"
              value={tipoVeiculo}
              options={[
                { value: "", label: "Selecione..." },
                ...tiposVeiculo,
              ]}
              onChange={(value) => {
                setTipoVeiculo(value);
                setErro("");
              }}
            />
          </FormField>
        )}

        <FormMessage className="perfil-form-error">{erro}</FormMessage>

        <FormActions
          className="perfil-modal-acoes"
          cancelClassName="perfil-botao-secundario"
          confirmClassName="perfil-botao-primario"
          confirmText="Salvar informações"
          loading={salvando}
          onCancel={onClose}
        />
      </form>

      <Alert
        isOpen={confirmOpen}
        title="Confirmar configurações de coleta?"
        message={`Você informou ${materiais.length} material(is) aceito(s) e ${possuiVeiculo ? "possui veículo para coleta" : "não possui veículo para coleta"}.`}
        variant="info"
        confirmText="Salvar configurações"
        cancelText="Revisar"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
        loading={salvando}
      />
    </Modal>
  );
}

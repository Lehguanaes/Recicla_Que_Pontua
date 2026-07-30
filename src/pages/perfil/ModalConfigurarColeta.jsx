import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import Alert from "../../components/alert/Alert";

export const materiaisDisponiveis = [
  { value: "papel", label: "Papel" },
  { value: "papelao", label: "Papelão" },
  { value: "plastico", label: "Plástico" },
  { value: "metal", label: "Metal" },
  { value: "vidro", label: "Vidro" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "oleo-cozinha", label: "Óleo de cozinha" },
];

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
        materiaisDisponiveis.map((material) => material.value)
      );
      setMateriais(
        (dadosAtuais?.materiaisAceitos || []).filter((material) =>
          materiaisPermitidos.has(material)
        )
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
      <h2 className="perfil-modal-titulo">Configurar coleta</h2>
   
      <form className="perfil-form" onSubmit={handleSubmit} noValidate>
        <div className="perfil-input-group full">
          <label>Materiais que você recebe</label>
          <div className="perfil-checkbox-grid">
            {materiaisDisponiveis.map((material) => (
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
        </div>

        <div className="perfil-input-group full">
          <label>Possui veículo?</label>
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
        </div>

        {possuiVeiculo && (
          <div className="perfil-input-group full">
            <label htmlFor="tipoVeiculo">Tipo de veículo</label>
            <select
              id="tipoVeiculo"
              value={tipoVeiculo}
              onChange={(e) => {
                setTipoVeiculo(e.target.value);
                setErro("");
              }}
            >
              <option value="">Selecione...</option>
              {tiposVeiculo.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        )}

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
            type="submit"
            className="perfil-botao-primario"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar informações"}
          </button>
        </div>
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

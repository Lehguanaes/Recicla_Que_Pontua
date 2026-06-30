import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBatteryHalf,
  FaBoxOpen,
  FaCheckCircle,
  FaFileAlt,
  FaLaptop,
  FaLeaf,
  FaMinus,
  FaOilCan,
  FaPlus,
  FaRecycle,
  FaTint,
  FaWineBottle,
} from "react-icons/fa";
import { MATERIAL_TYPES } from "../../constants";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import "./cadastrarMateriais.css";

const MATERIAL_ESTIMATES = {
  papel: {
    unit: "kg",
    step: 1,
    initial: 0,
    weightPerUnit: 1,
    waterPerUnit: 22,
    energyPerUnit: 1.8,
    pointsPerUnit: 8,
    icon: FaFileAlt,
  },
  papelao: {
    unit: "kg",
    step: 1,
    initial: 0,
    weightPerUnit: 1,
    waterPerUnit: 16,
    energyPerUnit: 1.4,
    pointsPerUnit: 7,
    icon: FaBoxOpen,
  },
  plastico: {
    unit: "un",
    step: 1,
    initial: 0,
    weightPerUnit: 0.04,
    waterPerUnit: 2.5,
    energyPerUnit: 0.35,
    pointsPerUnit: 2,
    icon: FaRecycle,
  },
  vidro: {
    unit: "kg",
    step: 1,
    initial: 0,
    weightPerUnit: 1,
    waterPerUnit: 5,
    energyPerUnit: 0.9,
    pointsPerUnit: 6,
    icon: FaWineBottle,
  },
  metal: {
    unit: "un",
    step: 1,
    initial: 0,
    weightPerUnit: 0.015,
    waterPerUnit: 8,
    energyPerUnit: 0.6,
    pointsPerUnit: 3,
    icon: FaLeaf,
  },
  eletronico: {
    unit: "un",
    step: 1,
    initial: 0,
    weightPerUnit: 0.8,
    waterPerUnit: 35,
    energyPerUnit: 3.4,
    pointsPerUnit: 20,
    icon: FaLaptop,
  },
  oleo: {
    unit: "L",
    step: 1,
    initial: 0,
    weightPerUnit: 0.92,
    waterPerUnit: 1000,
    energyPerUnit: 1.2,
    pointsPerUnit: 15,
    icon: FaOilCan,
  },
};

const formatNumber = (value, decimals = 1) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: value % 1 === 0 ? 0 : decimals,
  }).format(value);

const CadastrarMateriais = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const materialOptions = MATERIAL_TYPES.filter(
    (material) => material.value && MATERIAL_ESTIMATES[material.value]
  );
  const [quantities, setQuantities] = useState(() =>
    materialOptions.reduce((acc, material) => {
      acc[material.value] = MATERIAL_ESTIMATES[material.value]?.initial || 0;
      return acc;
    }, {})
  );

  const selectedMaterials = useMemo(
    () =>
      materialOptions
        .map((material) => ({
          ...material,
          quantity: quantities[material.value] || 0,
          estimate: MATERIAL_ESTIMATES[material.value],
        }))
        .filter((material) => material.quantity > 0),
    [materialOptions, quantities]
  );

  const totals = selectedMaterials.reduce(
    (acc, material) => {
      acc.weight += material.quantity * material.estimate.weightPerUnit;
      acc.water += material.quantity * material.estimate.waterPerUnit;
      acc.energy += material.quantity * material.estimate.energyPerUnit;
      acc.points += material.quantity * material.estimate.pointsPerUnit;
      return acc;
    },
    { weight: 0, water: 0, energy: 0, points: 0 }
  );

  const updateQuantity = (materialValue, nextValue) => {
    setQuantities((current) => ({
      ...current,
      [materialValue]: Math.max(0, Number(nextValue) || 0),
    }));
  };

  const handleRegister = () => {
    navigate("/doacao/encontrar-parceiros", {
      state: {
        registeredMaterials: selectedMaterials.map((material) => ({
          value: material.value,
          label: material.label,
          quantity: material.quantity,
          unit: material.estimate.unit,
        })),
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="materials-page">
        <section className="materials-hero">
          <span className="materials-kicker">
            <FaRecycle /> Reciclagem de Materiais
          </span>
          <h1>Cadastre os materiais disponíveis que você tem!</h1>
          <p>
            Informe as quantidades antes de procurar catadores e centros de
            coleta. A calculadora estima o impacto ambiental e prepara sua
            solicitacao.
          </p>
        </section>

        <section className="materials-grid" aria-label="Materiais para cadastro">
          {materialOptions.map((material) => {
            const estimate = MATERIAL_ESTIMATES[material.value];
            const Icon = estimate.icon;
            const quantity = quantities[material.value] || 0;

            return (
              <article
                className={`material-card ${quantity > 0 ? "active" : ""}`}
                key={material.value}
              >
                <div className="material-icon">
                  <Icon />
                </div>
                <strong>{material.label}</strong>
                <span>{estimate.unit === "un" ? "Unidades" : estimate.unit}</span>

                <div className="material-stepper">
                  <button
                    type="button"
                    aria-label={`Diminuir ${material.label}`}
                    onClick={() =>
                      updateQuantity(material.value, quantity - estimate.step)
                    }
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    min="0"
                    step={estimate.step}
                    value={quantity}
                    aria-label={`Quantidade de ${material.label}`}
                    onChange={(event) =>
                      updateQuantity(material.value, event.target.value)
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Aumentar ${material.label}`}
                    onClick={() =>
                      updateQuantity(material.value, quantity + estimate.step)
                    }
                  >
                    <FaPlus />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="impact-section" aria-label="Resultados estimados">
          <div className="impact-heading">
            <h2><FaLeaf color="var(--secondary)" />  Resultados estimados</h2>
            <p>
            O quanto você pode impactar com a reciclagem dos seus materiais?
          </p>
          </div>

          <div className="impact-grid">
            <article className="impact-card">
              <FaBoxOpen />
              <strong>{formatNumber(totals.weight)} kg</strong>
              <span>Peso total</span>
            </article>
            <article className="impact-card">
              <FaTint />
              <strong>{formatNumber(totals.water, 0)} L</strong>
              <span>Agua economizada</span>
            </article>
            <article className="impact-card">
              <FaBatteryHalf />
              <strong>{formatNumber(totals.energy)} kWh</strong>
              <span>Energia poupada</span>
            </article>
            <article className="impact-card">
              <FaLeaf />
              <strong>{formatNumber(totals.points, 0)}</strong>
              <span>Pontos previstos</span>
            </article>
          </div>
        </section>

        <div className="materials-actions">
          <button
            type="button"
            className="materials-submit"
            onClick={() => setShowConfirm(true)}
            disabled={selectedMaterials.length === 0}
          >
            Cadastrar materiais <FaArrowRight />
          </button>
        </div>

        {showConfirm && (
          <div
            className="materials-confirm-overlay"
            role="presentation"
            onClick={() => setShowConfirm(false)}
          >
            <section
              className="materials-confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="materials-confirm-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="materials-confirm-icon">
                <FaCheckCircle />
              </div>

              <h2 id="materials-confirm-title">Confirmar materiais?</h2>
              <p>
                Vamos usar esses itens para filtrar catadores e centros de
                coleta que aceitam seus materiais.
              </p>

              <div className="materials-confirm-tags">
                {selectedMaterials.map((material) => (
                  <span key={material.value}>
                    {material.quantity} {material.estimate.unit} de {material.label}
                  </span>
                ))}
              </div>

              <div className="materials-confirm-actions">
                <button
                  type="button"
                  className="materials-confirm-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Revisar
                </button>
                <button
                  type="button"
                  className="materials-confirm-submit"
                  onClick={handleRegister}
                >
                  Confirmar <FaArrowRight />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <Rodape />
    </>
  );
};

export default CadastrarMateriais;
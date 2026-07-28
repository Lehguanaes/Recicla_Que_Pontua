import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBatteryHalf,
  FaBoxOpen,
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
import Alert from "../../components/alert/Alert";
import PetRecicla from "../../assets/PetRecicla.png";
import PetDuvidas from "../../assets/PetDuvidas.png";
import "./cadastrarMateriais.css";

const MATERIAL_ESTIMATES = {
  papel: {
    unit: "kg",
    description: "Folhas, jornais e embalagens de papel secas.",
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
    description: "Caixas e embalagens limpas, secas e desmontadas.",
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
    description: "Garrafas, potes, tampas e outras embalagens.",
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
    description: "Garrafas, potes e frascos devidamente protegidos.",
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
    description: "Latas, ferragens e pequenas peças de sucata.",
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
    description: "Cabos, aparelhos e componentes eletrônicos sem uso.",
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
    description: "Óleo de cozinha guardado em uma garrafa bem fechada.",
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

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
          <div className="materials-hero-inner">
            <div className="materials-hero-layout">
              <div className="materials-hero-copy">
                <span className="materials-kicker">
                  <FaRecycle /> Reciclagem de materiais
                </span>

                <h1>Cadastre seus materiais recicláveis</h1>
                <p>
                  Informe o que você separou usando os controles de quantidade.
                  Você pode cadastrar diferentes categorias para estimar seu
                  impacto e encontrar parceiros compatíveis com todos os
                  materiais.
                </p>
              </div>

              <div className="materials-hero-visual" aria-hidden="true">
                <img className="pet-floating" src={PetRecicla} alt="" />
              </div>
            </div>

            <div
              className="materials-grid"
              aria-label="Materiais para cadastro"
            >
              {materialOptions.map((material) => {
                const estimate = MATERIAL_ESTIMATES[material.value];
                const Icon = estimate.icon;
                const quantity = quantities[material.value] || 0;

                return (
                  <article
                    className={`material-card ${quantity > 0 ? "active" : ""}`}
                    key={material.value}
                  >
                    <div className="material-card-heading">
                      <div className="material-icon">
                        <Icon />
                      </div>
                      <div>
                        <strong>{material.label}</strong>
                        <span>
                          {estimate.unit === "un" ? "Unidades" : estimate.unit}
                        </span>
                      </div>
                    </div>

                    <p>{estimate.description}</p>

                    <div className="material-stepper">
                      <button
                        type="button"
                        aria-label={`Diminuir ${material.label}`}
                        onClick={() =>
                          updateQuantity(
                            material.value,
                            quantity - estimate.step
                          )
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
                          updateQuantity(
                            material.value,
                            quantity + estimate.step
                          )
                        }
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="impact-section"
          aria-labelledby="impact-section-title"
        >
          <div className="impact-inner">
            <div className="impact-heading">
              <span className="materials-section-tag">
                <FaLeaf /> Impacto previsto
              </span>
              <h2 id="impact-section-title">Veja o impacto da sua seleção</h2>
              <p>
                Esta é uma prévia calculada a partir dos tipos e das quantidades
                informadas. Ela ajuda a visualizar o peso aproximado, os
                recursos que podem ser poupados e os pontos que a entrega pode
                gerar. Os valores finais são confirmados após a reciclagem.
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
                <span>Água economizada</span>
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

            <div className="materials-actions">
              <button
                type="button"
                className="materials-submit"
                onClick={() => setShowConfirm(true)}
                disabled={selectedMaterials.length === 0}
              >
                Continuar
              </button>
            </div>
          </div>
        </section>

        <section className="materials-help-section">
          <img
            className="pet-floating"
            src={PetDuvidas}
            alt="Mascote ajudando com dúvidas sobre reciclagem"
          />
          <div>
            <h2>Dúvidas? Aprenda com o conteúdo de Como reciclar</h2>
            <p>
              Veja como separar, limpar e armazenar cada material antes da
              entrega, além de orientações para itens que exigem cuidados
              especiais.
            </p>
          </div>
          <Link to="/como-reciclar">
            Aprender como reciclar
          </Link>
        </section>

        <Alert
          isOpen={showConfirm}
          title="Confirmar materiais?"
          message="Vamos usar esses itens para filtrar coletores e centros de reciclagem que aceitam seus materiais."
          variant="success"
          confirmText="Confirmar"
          cancelText="Revisar"
          onConfirm={handleRegister}
          onCancel={() => setShowConfirm(false)}
        >
          <div className="materials-confirm-tags">
            {selectedMaterials.map((material) => (
              <span key={material.value}>
                {material.quantity} {material.estimate.unit} de {material.label}
              </span>
            ))}
          </div>
        </Alert>
      </main>

      <Rodape />
    </>
  );
};

export default CadastrarMateriais;

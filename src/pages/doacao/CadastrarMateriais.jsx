import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import PageLayout from "../../components/layout/PageLayout";
import Alert from "../../components/alert/Alert";
import Button from "../../components/button/Button";
import IconButton from "../../components/button/IconButton";
import {
  PageHeader,
  SectionHeader,
} from "../../components/typography/Typography";
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
  const location = useLocation();
  const [showImpact, setShowImpact] = useState(false);
  const materialOptions = MATERIAL_TYPES.filter(
    (material) => material.value && MATERIAL_ESTIMATES[material.value]
  );
  const [quantities, setQuantities] = useState(() => {
    const reviewedMaterials = location.state?.registeredMaterials || [];

    return materialOptions.reduce((acc, material) => {
      const reviewedMaterial = reviewedMaterials.find(
        (item) => item.value === material.value
      );
      acc[material.value] =
        reviewedMaterial?.quantity ||
        MATERIAL_ESTIMATES[material.value]?.initial ||
        0;
      return acc;
    }, {});
  });

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
      <PageLayout>

      <main className="materials-page">
        <section className="materials-hero">
          <div className="materials-hero-inner">
            <div className="materials-hero-layout">
              <PageHeader
                as="div"
                className="materials-hero-copy"
                eyebrowClassName="materials-kicker"
                eyebrow="Reciclagem de materiais"
                icon={<FaRecycle />}
                title="Cadastre seus materiais recicláveis"
                text="Informe o que você separou usando os controles de quantidade. Você pode cadastrar diferentes categorias para estimar seu impacto e encontrar parceiros compatíveis com todos os materiais."
              />

              <div className="materials-hero-visual" aria-hidden="true">
                <img className="section-title-image pet-floating" src={PetRecicla} alt="" />
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
                      <IconButton
                        label={`Diminuir ${material.label}`}
                        onClick={() =>
                          updateQuantity(
                            material.value,
                            quantity - estimate.step
                          )
                        }
                      >
                        <FaMinus />
                      </IconButton>
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
                      <IconButton
                        label={`Aumentar ${material.label}`}
                        onClick={() =>
                          updateQuantity(
                            material.value,
                            quantity + estimate.step
                          )
                        }
                      >
                        <FaPlus />
                      </IconButton>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="materials-actions">
              <Button
                variant="gradient"
                type="button"
                className="materials-submit"
                onClick={() => setShowImpact(true)}
                disabled={selectedMaterials.length === 0}
              >
                Continuar
              </Button>
            </div>
          </div>
        </section>

        <section
          className="impact-section"
          aria-labelledby="impact-section-title"
        >
          <div className="impact-inner">
            <SectionHeader
              className="impact-heading"
              eyebrowClassName="materials-section-tag"
              eyebrow="Impacto da reciclagem"
              icon={<FaLeaf />}
              titleId="impact-section-title"
              title="Entenda o que cada métrica representa"
              text="As estimativas ajudam a transformar sua seleção em informações fáceis de visualizar. Conheça o significado de cada indicador antes de conferir os valores calculados para os seus materiais."
            />

            <div className="impact-grid impact-explanation-grid">
              <article className="impact-card impact-explanation-card">
                <FaBoxOpen />
                <strong>Peso estimado</strong>
                <p>
                  Converte as quantidades informadas em um peso aproximado dos
                  materiais separados.
                </p>
              </article>
              <article className="impact-card impact-explanation-card">
                <FaTint />
                <strong>Água preservada</strong>
                <p>
                  Indica a quantidade estimada de água que pode ser poupada com
                  o reaproveitamento dos materiais.
                </p>
              </article>
              <article className="impact-card impact-explanation-card">
                <FaBatteryHalf />
                <strong>Energia poupada</strong>
                <p>
                  Representa a economia aproximada de energia em comparação à
                  produção com novas matérias-primas.
                </p>
              </article>
              <article className="impact-card impact-explanation-card">
                <FaLeaf />
                <strong>Pontos previstos</strong>
                <p>
                  Mostra uma prévia dos pontos que a entrega poderá gerar após a
                  reciclagem ser confirmada.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="materials-help-section">
          <img
            className="pet-floating"
            src={PetDuvidas}
            alt="Mascote ajudando com dúvidas sobre reciclagem"
          />
          <SectionHeader
            title="Dúvidas? Aprenda com o conteúdo de Como reciclar"
            text="Veja como separar, limpar e armazenar cada material antes da entrega, além de orientações para itens que exigem cuidados especiais."
          />
          <Button variant="gradient" to="/como-reciclar">
            Aprender como reciclar
          </Button>
        </section>

        <Alert
          isOpen={showImpact}
          title="Confira o impacto previsto"
          message="Estas métricas são estimativas calculadas a partir dos materiais e das quantidades informadas. Os valores finais serão confirmados depois da reciclagem."
          variant="info"
          confirmText="Encontrar parceiros"
          cancelText="Revisar materiais"
          onConfirm={handleRegister}
          onCancel={() => setShowImpact(false)}
          className="materials-impact-modal"
        >
          <div className="materials-impact-selection">
            <strong>Materiais selecionados</strong>
            <div className="materials-confirm-tags">
              {selectedMaterials.map((material) => (
                <span key={material.value}>
                  {material.quantity} {material.estimate.unit} de {material.label}
                </span>
              ))}
            </div>
          </div>

          <div className="impact-grid" aria-label="Métricas de impacto previstas">
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

          <p className="materials-impact-note">
            Ao continuar, usaremos sua seleção para encontrar coletores e centros
            de reciclagem compatíveis.
          </p>
        </Alert>
      </main>

      </PageLayout>
    </>
  );
};

export default CadastrarMateriais;

import { useEffect, useState } from "react";
import Loading from "../../contexts/Loading";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaLock,
  FaCamera,
  FaEnvelope,
  FaIdCard,
  FaUserCircle,
  FaEdit,
  FaRecycle,
} from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/Firebase";
import { perfilInfo } from "../login/cadastro/CadastroData";

import ModalEditarEndereco from "./ModalEditarEndereco";
import ModalEditarTelefone from "./ModalEditarTelefone";
import ModalEditarSenha from "./ModalEditarSenha";
import ModalEditarFoto from "./ModalEditarFoto";
import ModalConfigurarColeta from "./ModalConfigurarColeta";

import "./perfil.css";

export default function Perfil() {
  const { user } = useAuth();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(null); // "endereco" | "telefone" | "senha" | "foto" | "coleta" | null

  useEffect(() => {
    async function carregarDados() {
      if (!user?.uid) {
        setCarregando(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "usuarios", user.uid));

        if (snap.exists()) {
          setDados(snap.data());
        }
      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [user]);

  function atualizarDadosLocais(novosCampos) {
    setDados((prev) => ({ ...(prev || {}), ...novosCampos }));
  }

  async function salvarNoFirestore(campos) {
    if (!user?.uid) return;
    await updateDoc(doc(db, "usuarios", user.uid), campos);
  }

  // No Firestore só o CEP fica separado; o resto do endereço fica
  // agrupado em um único campo "endereco" (objeto), evitando espalhar
  // rua/numero/bairro/cidade/estado como campos soltos no documento.
  const endereco = dados?.endereco || {};

  const enderecoCompleto = Boolean(
    dados?.cep && endereco.rua && endereco.numero && endereco.bairro
  );

  const ehPessoaJuridica =
    dados?.perfil === "instituicao-recicladora" ||
    dados?.perfil === "centro-coleta";

  // Perfis para os quais informar materiais aceitos e disponibilidade de
  // veículo é essencial, pois influencia diretamente o recebimento de
  // solicitações de doação.
  const ehPerfilDeColeta =
    dados?.perfil === "coletor-autonomo" || dados?.perfil === "centro-coleta";

  const materiaisCadastrados =
    Array.isArray(dados?.materiaisAceitos) && dados.materiaisAceitos.length > 0;

  const veiculoInformado =
    dados?.possuiVeiculo === true || dados?.possuiVeiculo === false;

  const perfilColetaIncompleto =
    ehPerfilDeColeta && (!materiaisCadastrados || !veiculoInformado);

  const rotuloDocumento = ehPessoaJuridica ? "CNPJ" : "CPF";
  const numeroDocumento = ehPessoaJuridica ? dados?.cnpj : dados?.cpf;

  const enderecoResumo = enderecoCompleto
    ? `${endereco.rua}, ${endereco.numero}${
        endereco.complemento ? " - " + endereco.complemento : ""
      } - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} - CEP ${dados.cep}`
    : [
        endereco.cidade || dados?.cidade,
        endereco.estado || dados?.estado,
      ]
        .filter(Boolean)
        .join("/") || "Não informado";

  if (carregando) {
    return <Loading mensagem="Carregando seu perfil..." />;
  }
  return (
    <>
      <Navbar />

      <main className="perfil-page">
        <div className="perfil-container">
          <header className="perfil-cabecalho">
            <span className="perfil-kicker">
              <FaUserCircle /> Meu perfil
            </span>
            <h1>Suas informações em um só lugar</h1>
            <p>
              Confira seus dados e mantenha seu perfil atualizado para aproveitar
              melhor cada recurso da plataforma.
            </p>
          </header>

          {!enderecoCompleto && (
            <div className="perfil-alerta">
              <FaMapMarkerAlt className="perfil-alerta-icone" />

              <div className="perfil-alerta-texto">
                <strong>Complete seu endereço</strong>
                <p>
                Se desejar, você pode informar seu endereço completo. Essa etapa é totalmente opcional, mas ajuda a complementar o seu perfil, aprimora a filtragem das informações no site e contribui para uma experiência mais segura para todos.
                </p>
              </div>

              <div className="perfil-alerta-acoes">
                <button
                  type="button"
                  className="perfil-alerta-botao"
                  onClick={() => setModalAberto("endereco")}
                >
                  Adicionar endereço
                </button>
              </div>
            </div>
          )}

          {perfilColetaIncompleto && (
            <div className="perfil-alerta perfil-alerta-coleta">
              <FaRecycle className="perfil-alerta-icone" />

              <div className="perfil-alerta-texto">
                <strong>Complete seu perfil de coleta</strong>
                <p>
                  Informe os materiais que você recebe e se possui veículo
                  para realizar coletas. Essas informações ajudam os
                  usuários a encontrar o parceiro mais adequado e aumentam
                  suas chances de receber novas solicitações.
                </p>
              </div>

              <div className="perfil-alerta-acoes">
                <button
                  type="button"
                  className="perfil-alerta-botao"
                  onClick={() => setModalAberto("coleta")}
                >
                  Configurar coleta
                </button>
              </div>
            </div>
          )}

          <div className="perfil-layout">
          <section className="perfil-card perfil-resumo">
              <div className="perfil-avatar-wrapper pet-floating">
                {dados?.fotoPerfil ? (
                  <img
                    src={dados.fotoPerfil}
                    alt="Foto de perfil"
                    className="perfil-avatar-img"
                  />
                ) : (
                  <FaUserCircle className="perfil-avatar-placeholder" />
                )}

                <button
                  type="button"
                  className="perfil-avatar-editar"
                  aria-label="Alterar foto de perfil"
                  onClick={() => setModalAberto("foto")}
                >
                  <FaCamera />
                </button>
              </div>

              <div className="perfil-resumo-texto">
                <h2>{dados?.nome || "Usuário"}</h2>
                <span className="perfil-badge-tipo">
                  {perfilInfo[dados?.perfil]?.label || "Usuário"}
                </span>
                <p className="perfil-resumo-ajuda">
                  Sua foto e seu nome ajudam outros participantes a reconhecer
                  você nas interações da plataforma.
                </p>
              </div>
            </section>

          <section className="perfil-card perfil-informacoes">
            <h3 className="perfil-card-titulo">Minhas informações</h3>
            <p className="perfil-card-subtitulo">
              Confira os dados cadastrados e atualize o que precisar.
            </p>

            <div className="perfil-info-lista">
              <div className="perfil-info-linha">
                <FaEnvelope className="perfil-info-icone" />
                <div className="perfil-info-texto">
                  <span className="perfil-info-label">E-mail</span>
                  <span className="perfil-info-valor">
                    {dados?.email || user?.email}
                  </span>
                </div>
              </div>

              <div className="perfil-info-linha">
                <FaIdCard className="perfil-info-icone" />
                <div className="perfil-info-texto">
                  <span className="perfil-info-label">{rotuloDocumento}</span>
                  <span className="perfil-info-valor">
                    {numeroDocumento || "Não informado"}
                  </span>
                </div>
              </div>

              <div className="perfil-info-linha perfil-info-linha-full">
                <FaMapMarkerAlt className="perfil-info-icone" />
                <div className="perfil-info-texto">
                  <span className="perfil-info-label">Endereço</span>
                  <span className="perfil-info-valor">{enderecoResumo}</span>
                </div>
                <button
                  type="button"
                  className="perfil-info-editar"
                  onClick={() => setModalAberto("endereco")}
                >
                  <FaEdit /> {enderecoCompleto ? "Editar" : "Adicionar"}
                </button>
              </div>

              <div className="perfil-info-linha">
                <FaPhoneAlt className="perfil-info-icone" />
                <div className="perfil-info-texto">
                  <span className="perfil-info-label">Telefone</span>
                  <span className="perfil-info-valor">
                    {dados?.telefone || "Não informado"}
                  </span>
                </div>
                <button
                  type="button"
                  className="perfil-info-editar"
                  onClick={() => setModalAberto("telefone")}
                >
                  <FaEdit /> Editar
                </button>
              </div>

              <div className="perfil-info-linha">
                <FaLock className="perfil-info-icone" />
                <div className="perfil-info-texto">
                  <span className="perfil-info-label">Senha</span>
                  <span className="perfil-info-valor">••••••••</span>
                </div>
                <button
                  type="button"
                  className="perfil-info-editar"
                  onClick={() => setModalAberto("senha")}
                >
                  <FaEdit /> Alterar
                </button>
              </div>

              {ehPerfilDeColeta && (
                <div className="perfil-info-linha perfil-info-linha-full">
                  <FaRecycle className="perfil-info-icone" />
                  <div className="perfil-info-texto">
                    <span className="perfil-info-label">Informações de coleta</span>
                    <span className="perfil-info-valor">
                      {materiaisCadastrados
                        ? `${dados.materiaisAceitos.length} ${
                            dados.materiaisAceitos.length === 1
                              ? "material aceito"
                              : "materiais aceitos"
                          }`
                        : "Nenhum material informado"}
                      {" · "}
                      {veiculoInformado
                        ? dados.possuiVeiculo
                          ? `Possui veículo (${dados.tipoVeiculo || "não especificado"})`
                          : "Não possui veículo"
                        : "Veículo não informado"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="perfil-info-editar"
                    onClick={() => setModalAberto("coleta")}
                  >
                    <FaEdit /> {materiaisCadastrados || veiculoInformado ? "Editar" : "Adicionar"}
                  </button>
                </div>
              )}
            </div>
          </section>
          </div>
        </div>
      </main>


      <ModalEditarEndereco
        isOpen={modalAberto === "endereco"}
        onClose={() => setModalAberto(null)}
        dadosAtuais={dados}
        onSalvar={salvarNoFirestore}
        onSalvo={atualizarDadosLocais}
      />

      <ModalEditarTelefone
        isOpen={modalAberto === "telefone"}
        onClose={() => setModalAberto(null)}
        telefoneAtual={dados?.telefone}
        onSalvar={salvarNoFirestore}
        onSalvo={atualizarDadosLocais}
      />

      <ModalEditarSenha
        isOpen={modalAberto === "senha"}
        onClose={() => setModalAberto(null)}
      />

      <ModalEditarFoto
        isOpen={modalAberto === "foto"}
        onClose={() => setModalAberto(null)}
        fotoAtual={dados?.fotoPerfil}
        onSalvar={salvarNoFirestore}
        onSalvo={atualizarDadosLocais}
      />

      <ModalConfigurarColeta
        isOpen={modalAberto === "coleta"}
        onClose={() => setModalAberto(null)}
        dadosAtuais={dados}
        onSalvar={salvarNoFirestore}
        onSalvo={atualizarDadosLocais}
      />

      <Rodape />
    </>
  );
}

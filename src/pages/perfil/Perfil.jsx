import { useEffect, useState } from "react";
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
  FaTimes,
} from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/Firebase";
import { perfilInfo } from "../login/cadastro/CadastroData";

import ModalEditarEndereco from "./ModalEditarEndereco";
import ModalEditarTelefone from "./ModalEditarTelefone";
import ModalEditarSenha from "./ModalEditarSenha";
import ModalEditarFoto from "./ModalEditarFoto";

import "./perfil.css";

export default function Perfil() {
  const { user } = useAuth();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(null); // "endereco" | "telefone" | "senha" | "foto" | null
  const [alertaFechado, setAlertaFechado] = useState(false);

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

  // Mescla novos campos salvos localmente, sem precisar buscar tudo de novo no Firestore
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
    return (
      <>
        <Navbar />
        <main className="perfil-page">
          <p className="perfil-carregando">Carregando seu perfil...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="perfil-page">
        <div className="perfil-container">
          <p className="perfil-boas-vindas">
            Olá, {dados?.nome || user?.email}! Seja bem-vindo(a).
          </p>

          {!enderecoCompleto && !alertaFechado && (
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

                <button
                  type="button"
                  className="perfil-alerta-fechar"
                  aria-label="Fechar aviso"
                  onClick={() => setAlertaFechado(true)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          <section className="perfil-card perfil-resumo">
            <div className="perfil-avatar-wrapper">
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
            </div>
          </section>

          <section className="perfil-card">
            <h3 className="perfil-card-titulo">Minhas informações</h3>
            <p className="perfil-card-subtitulo">
              Aqui você pode conferir seus dados e editar as informações
              mais simples, como telefone, senha e foto de perfil.
            </p>

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
          </section>
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
    </>
  );
}

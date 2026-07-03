import { authApi } from './AuthApi';

const TOKEN_KEY = 'rqp_token';
const USER_KEY = 'rqp_user';

// ============================================================
// AUTH SERVICE — regra de negócio de autenticação/sessão
// ============================================================

/**
 * Cadastra um usuário a partir dos dados do formulário de cadastro.
 * @param {string} perfilSelecionado - ex: "catador-autonomo"
 * @param {Object} formData - dados dos campos dinâmicos (nome, cpf, email...)
 * @param {string} password - senha escolhida
 */
export async function cadastrarUsuario(perfilSelecionado, formData, password) {
  const payload = {
    perfil: perfilSelecionado,
    ...formData,
    senha: password,
  };

  const resposta = await authApi.register(payload);

  if (resposta?.token) {
    salvarSessao(resposta.token, resposta.usuario);
  }

  return resposta;
}

/**
 * Autentica o usuário com e-mail/CPF/CNPJ (identifier) + senha.
 */
export async function loginUsuario(identifier, password) {
  const resposta = await authApi.login({ identifier, senha: password });

  if (resposta?.token) {
    salvarSessao(resposta.token, resposta.usuario);
  }

  return resposta;
}

/**
 * Encerra a sessão local e no backend (se houver token).
 */
export async function logoutUsuario() {
  const token = getToken();

  try {
    if (token) await authApi.logout(token);
  } finally {
    limparSessao();
  }
}

/**
 * Busca os dados do usuário logado a partir do token salvo.
 */
export async function usuarioAtual() {
  const token = getToken();
  if (!token) return null;

  try {
    return await authApi.me(token);
  } catch {
    // token inválido/expirado
    limparSessao();
    return null;
  }
}

// ============================================================
// SESSÃO (localStorage)
// ============================================================
function salvarSessao(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  if (usuario) localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuarioSalvo() {
  const bruto = localStorage.getItem(USER_KEY);
  return bruto ? JSON.parse(bruto) : null;
}

export function isAutenticado() {
  return !!getToken();
}

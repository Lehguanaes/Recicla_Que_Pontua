import { API_CONFIG } from '../constants';

// ============================================================
// HTTP CLIENT BASE — mesmo padrão usado em services/api.js
// ============================================================
const request = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    // algumas respostas (ex: logout) podem não ter corpo
    return response.status !== 204 ? response.json() : null;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Tempo de requisição esgotado.');
    throw err;
  }
};

// ============================================================
// AUTH API — chamadas HTTP puras (sem regra de negócio)
// ============================================================
export const authApi = {
  /**
   * Cadastra um novo usuário
   * @param {Object} payload - { perfil, ...formData, senha }
   */
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Autentica um usuário existente
   * @param {Object} credentials - { identifier, senha }
   */
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Encerra a sessão no backend (invalida o token, se aplicável)
   */
  logout: (token) =>
    request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Retorna os dados do usuário autenticado a partir do token salvo
   */
  me: (token) =>
    request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default authApi;

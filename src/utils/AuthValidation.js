import {
  validarCPF,
  validarCNPJ,
  validarEmail,
  validarTelefone,
  validarCEP,
} from "./ValidatorsDadosSensiveis";

// ==========================================
// Validações auxiliares
// ==========================================

export function validarNome(nome) {

  nome = (nome || "").trim();

  const partes = nome.split(/\s+/);

  if (partes.length < 2) return false;

  return partes.every(parte =>
    /^[A-Za-zÀ-ÿ]{2,}$/.test(parte)
  );
}

function validarTexto(texto) {
  return /^[A-Za-zÀ-ÿ\s]{2,}$/.test(texto.trim());
}

function validarDataNascimento(data) {
  return new Date(data) <= new Date();
}

// ==========================================
// Validação de formato por campo
// ==========================================

function validarFormatoCampo(name, valor) {
  const validadores = {
    nome: {
      validar: validarNome,
      mensagem: "Nome inválido.",
    },

    cpf: {
      validar: validarCPF,
      mensagem: "CPF inválido.",
    },

    cnpj: {
      validar: validarCNPJ,
      mensagem: "CNPJ inválido.",
    },

    email: {
      validar: validarEmail,
      mensagem: "E-mail inválido.",
    },

    telefone: {
      validar: validarTelefone,
      mensagem: "Telefone inválido.",
    },

    cep: {
      validar: validarCEP,
      mensagem: "CEP inválido.",
    },

    cidade: {
      validar: validarTexto,
      mensagem: "Cidade inválida.",
    },

    estado: {
      validar: validarTexto,
      mensagem: "Estado inválido.",
    },

    dataNascimento: {
      validar: validarDataNascimento,
      mensagem: "Data de nascimento inválida.",
    },
  };

  const regra = validadores[name];

  if (!regra) return null;

  return regra.validar(valor) ? null : regra.mensagem;
}

// ==========================================
// Validação dos campos do formulário
// ==========================================

export function validarCampos(campos, formData) {
  const erros = {};

  campos.forEach(({ name, required }) => {
    const valor = formData[name];

    if (required && !valor?.trim()) {
      erros[name] = "Campo obrigatório.";
      return;
    }

    // Campo opcional vazio
    if (!valor) return;

    const erroFormato = validarFormatoCampo(name, valor);

    if (erroFormato) {
      erros[name] = erroFormato;
    }
  });

  return erros;
}

// ==========================================
// Validação completa do cadastro
// ==========================================

export function validarCadastro(
  password,
  confirmPassword
) {
  const erros = {};

  // Senha
  if (!password) {
    erros.senha = "Campo obrigatório.";
  } else if (password.length < 6) {
    erros.senha = "A senha deve possuir pelo menos 6 caracteres.";
  }

  // Confirmar senha
  if (!confirmPassword) {
    erros.confirmSenha = "Campo obrigatório.";
  } else if (password !== confirmPassword) {
    erros.confirmSenha = "As senhas não coincidem.";
  }

  return erros;
}
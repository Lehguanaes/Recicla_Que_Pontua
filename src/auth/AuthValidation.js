import {
  validarCPF,
  validarCNPJ,
  validarEmail,
  validarTelefone,
  validarCEP,
} from "./ValidatorsDadosSensiveis";

// Valida o formato de cada campo, de acordo com o "name"
function validarFormatoCampo(name, valor) {
  switch (name) {
    case "cpf":
      return validarCPF(valor) ? null : "CPF inválido.";
    case "cnpj":
      return validarCNPJ(valor) ? null : "CNPJ inválido.";
    case "email":
      return validarEmail(valor) ? null : "E-mail inválido.";
    case "telefone":
      return validarTelefone(valor) ? null : "Telefone inválido.";
    case "cep":
      return validarCEP(valor) ? null : "CEP inválido.";
    default:
      return null;
  }
}

// Valida apenas os campos dinâmicos do cadastro (etapa 1), sem mexer em senha
export function validarCampos(campos, formData) {
  const erros = {};

  campos.forEach(({ name, required }) => {
    const valor = formData[name];

    if (required && !valor?.trim()) {
      erros[name] = "Campo obrigatório.";
      return;
    }

    if (!valor) return; // campo opcional vazio, sem checar formato

    const erroFormato = validarFormatoCampo(name, valor);
    if (erroFormato) {
      erros[name] = erroFormato;
    }
  });

  return erros;
}

//validar cadastro
export function validarCadastro(
  campos,
  formData,
  password,
  confirmPassword
) {
  const erros = validarCampos(campos, formData);

  // Validação da senha
  if (!password) {
    erros.senha = "Campo obrigatório.";
  } else if (password.length < 6) {
    erros.senha = "Mínimo de 6 caracteres.";
  }

  // Confirmação da senha
  if (password !== confirmPassword) {
    erros.confirmSenha = "As senhas não coincidem.";
  }

  return erros;
}
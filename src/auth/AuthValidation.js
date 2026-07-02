
//validar cadastro
export function validarCadastro(
  campos,
  formData,
  password,
  confirmPassword
) {
  const erros = {};

  // Validação dos campos do formulário
  campos.forEach(({ name, required }) => {
    if (required && !formData[name]?.trim()) {
      erros[name] = "Campo obrigatório.";
    }
  });

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
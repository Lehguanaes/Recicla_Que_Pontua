// Validação de CPF (algoritmo padrão da Receita Federal)
export function validarCPF(cpf) {
  cpf = (cpf || "").replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // rejeita sequências tipo 111.111.111-11

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Validação de CNPJ (algoritmo padrão da Receita Federal)
export function validarCNPJ(cnpj) {
  cnpj = (cnpj || "").replace(/\D/g, "");

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcularDigito = (base) => {
    let pesos = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base.charAt(i)) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base12 = cnpj.substring(0, 12);
  const digito1 = calcularDigito(base12);
  const digito2 = calcularDigito(base12 + digito1);

  return cnpj === base12 + digito1.toString() + digito2.toString();
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test((email || "").trim());
}

export function validarTelefone(telefone) {
  const numeros = (telefone || "").replace(/\D/g, "");
  return numeros.length === 10 || numeros.length === 11;
}

export function validarCEP(cep) {
  const numeros = (cep || "").replace(/\D/g, "");
  return numeros.length === 8;
}
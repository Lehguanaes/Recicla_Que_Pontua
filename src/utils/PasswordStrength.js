//SENHA CONFIGURAÇÃO
export function calcStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  return score;
}

export const strengthConfig = [
  { label: "Fraca",  color: "weak"   },
  { label: "Média",  color: "medium" },
  { label: "Forte",  color: "strong" },
];
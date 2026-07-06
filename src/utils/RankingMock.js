
export const USUARIOS_MOCK = [
  { id: "1", nome: "Eco Verde", tipo: "instituicao", pontos: 5230, kgReciclado: 3800, pontosSemanaPassada: 4950 },
  { id: "2", nome: "Recicla Mais", tipo: "instituicao", pontos: 4870, kgReciclado: 3120, pontosSemanaPassada: 4870 },
  { id: "3", nome: "Maria Eduarda", tipo: "pessoa", pontos: 4520, kgReciclado: 210, pontosSemanaPassada: 4270 },
  { id: "4", nome: "Cooperativa Alfa", tipo: "instituicao", pontos: 4300, kgReciclado: 2600, pontosSemanaPassada: 4300 },
  { id: "5", nome: "Karinne Angelo", tipo: "pessoa", pontos: 4100, kgReciclado: 185, pontosSemanaPassada: 3900 },
  { id: "6", nome: "EcoColeta SP", tipo: "coletor", pontos: 3980, kgReciclado: 4100, pontosSemanaPassada: 3800 },
  { id: "7", nome: "Eduardo Costa", tipo: "pessoa", pontos: 3850, kgReciclado: 160, pontosSemanaPassada: 3850 },
  { id: "8", nome: "Cooperativa Verde", tipo: "instituicao", pontos: 3600, kgReciclado: 2200, pontosSemanaPassada: 3400 },
  { id: "9", nome: "Monica Cunha", tipo: "pessoa", pontos: 3200, kgReciclado: 140, pontosSemanaPassada: 3050 },
  { id: "10", nome: "Coleta Norte", tipo: "coletor", pontos: 2950, kgReciclado: 3300, pontosSemanaPassada: 2900 },
 
];

// Simula "quem está logado agora" — na integração real isso vem do auth (uid do Firebase)
export const ID_USUARIO_LOGADO = "9"; // João, só pra aparecer fora do pódio

export const FILTROS = [
  { chave: "geral", label: "Geral" },
  { chave: "pessoa", label: "Pessoas" },
  { chave: "instituicao", label: "Instituições" },
  { chave: "coletor", label: "Coletores" },
];

/** Ordena por pontos e devolve com posição (1-based) já calculada */
export function calcularRanking(usuarios, filtro = "geral") {
  const filtrados =
    filtro === "geral" ? usuarios : usuarios.filter((u) => u.tipo === filtro);

  return [...filtrados]
    .sort((a, b) => b.pontos - a.pontos)
    .map((u, index) => ({ ...u, posicao: index + 1 }));
}

/** Estatísticas dos cards do topo — sempre calculadas sobre a base geral, não sobre o filtro ativo */
export function calcularEstatisticas(usuarios) {
  const rankingGeral = calcularRanking(usuarios, "geral");
  const lider = rankingGeral[0];
  const totalReciclado = usuarios.reduce((soma, u) => soma + u.kgReciclado, 0);

  return {
    lider,
    totalRecicladoKg: totalReciclado,
    totalParticipantes: usuarios.length,
  };
}

/** Dados do card "Você está em Xº lugar" para o usuário logado */
export function calcularPosicaoUsuario(usuarios, idUsuario) {
  const rankingGeral = calcularRanking(usuarios, "geral");
  const usuarioAtual = rankingGeral.find((u) => u.id === idUsuario);
  if (!usuarioAtual) return null;

  const rankingSemanaPassada = [...usuarios]
    .sort((a, b) => b.pontosSemanaPassada - a.pontosSemanaPassada)
    .map((u, index) => ({ ...u, posicaoAnterior: index + 1 }));

  const posicaoAnterior = rankingSemanaPassada.find((u) => u.id === idUsuario)?.posicaoAnterior;
  const variacaoPosicoes = posicaoAnterior ? posicaoAnterior - usuarioAtual.posicao : 0;
  const pontosGanhosSemana = usuarioAtual.pontos - usuarioAtual.pontosSemanaPassada;

  return {
    ...usuarioAtual,
    variacaoPosicoes, 
    pontosGanhosSemana,
  };
}

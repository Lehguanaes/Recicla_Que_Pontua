import {
  FaLeaf,
  FaTruck,
  FaWarehouse,
  FaSchool,
  FaBook,
  FaSearch,
  FaCalendarAlt,
  FaGlobeAmericas,
  FaHandHoldingHeart,
  FaRobot,
} from "react-icons/fa";
import { PROFILE_IDS } from "../../constants/profiles";

export const perfis = [
  {
    id: PROFILE_IDS.PERSON,
    label: "Pessoa recicladora",
    icone: <FaLeaf />,
    resumo: "Dicas para separar, preparar e entregar materiais.",
    introducao:
      "Cuidados simples ajudam a preservar o material e facilitam o trabalho de quem fará a coleta.",
    topicos: [
      {
        titulo: "Separação no dia a dia",
        texto: "Organize os recicláveis por categoria e mantenha resíduos orgânicos longe dos materiais secos.",
      },
      {
        titulo: "Materiais bem preparados",
        texto: "Esvazie embalagens, retire o excesso de sujeira e proteja objetos que possam cortar ou perfurar.",
      },
      {
        titulo: "Entrega sem imprevistos",
        texto: "Informe corretamente os materiais e combine local, horário e forma de entrega com antecedência.",
      },
    ],
  },
  {
    id: PROFILE_IDS.COLLECTOR,
    label: "Coletor",
    icone: <FaTruck />,
    resumo: "Orientações de coleta, segurança e relacionamento com recicladores.",
    introducao:
      "Uma comunicação clara e uma coleta bem planejada tornam cada parceria mais segura e confiável.",
    topicos: [
      {
        titulo: "Conversas amigáveis",
        texto: "Cumprimente, explique como será a coleta e confirme o combinado com uma linguagem simples e respeitosa.",
      },
      {
        titulo: "Recolhimento organizado",
        texto: "Confira os tipos e as quantidades informadas, planeje a rota e avise caso ocorra algum atraso.",
      },
      {
        titulo: "Segurança durante a coleta",
        texto: "Use os equipamentos adequados e confirme se vidros, metais e materiais cortantes estão protegidos.",
      },
    ],
  },
  {
    id: PROFILE_IDS.CENTER,
    label: "Centro de reciclagem",
    icone: <FaWarehouse />,
    resumo: "Recebimento, triagem e comunicação dos materiais aceitos.",
    introducao:
      "Informações atualizadas ajudam a reduzir recusas e deixam o recebimento mais rápido para todos.",
    topicos: [
      {
        titulo: "Recebimento mais claro",
        texto: "Mantenha visíveis os materiais aceitos, os horários, as quantidades mínimas e as condições de entrega.",
      },
      {
        titulo: "Triagem eficiente",
        texto: "Defina uma rotina de conferência e sinalize áreas para cada categoria antes do armazenamento.",
      },
      {
        titulo: "Comunicação com parceiros",
        texto: "Explique recusas com cordialidade e oriente como o material poderá ser preparado numa próxima entrega.",
      },
    ],
  },
  {
    id: PROFILE_IDS.INSTITUTION,
    label: "Instituição de ensino",
    icone: <FaSchool />,
    resumo: "Campanhas, educação ambiental e mobilização de participantes.",
    introducao:
      "Ações simples e recorrentes transformam a reciclagem em uma experiência prática de aprendizagem coletiva.",
    topicos: [
      {
        titulo: "Campanhas que engajam",
        texto: "Defina uma meta fácil de entender, divulgue o período da ação e mostre o resultado alcançado.",
      },
      {
        titulo: "Educação ambiental prática",
        texto: "Relacione a coleta a atividades, oficinas e exemplos próximos da rotina dos participantes.",
      },
      {
        titulo: "Mobilização contínua",
        texto: "Crie responsáveis por turma ou setor e mantenha pontos de descarte identificados e acessíveis.",
      },
    ],
  },
];

export const guias = [
  {
    id: "reciclagem-para-iniciantes",
    titulo: "Reciclagem para iniciantes",
    nivel: "Iniciante",
    duracao: "30 min",
    icone: <FaBook />,
    resumo: "Aprenda a separar, preparar, armazenar e entregar seus recicláveis com segurança.",
    cta: { label: "Preparar materiais", to: "/doacao/cadastrar-materiais" },
    aulas: [
      {
        id: "entenda-o-ciclo",
        titulo: "Entenda o caminho do material",
        resumo: "Reciclar começa antes da coleta e continua depois da entrega.",
        conteudo: [
          "A reciclagem depende de separação, coleta, triagem e transformação. Cada etapa precisa receber o material em boas condições.",
          "Quando recicláveis são misturados a restos de comida, líquidos ou rejeitos, parte do lote pode perder qualidade ou ser descartada.",
          "Seu papel é identificar o material, prepará-lo com cuidado e confirmar um destino que realmente o receba.",
        ],
      },
      {
        id: "separe-por-categoria",
        titulo: "Separe por categoria",
        resumo: "Organize papel, plástico, vidro e metal sem misturar resíduos orgânicos.",
        conteudo: [
          "Mantenha os materiais secos separados de restos de comida, papel higiênico, guardanapos usados e outros rejeitos.",
          "Você não precisa usar vários recipientes: sacolas ou caixas identificadas já ajudam a organizar o que será entregue.",
          "Consulte sempre os materiais aceitos pelo coletor ou centro, pois a capacidade de recebimento pode variar.",
        ],
      },
      {
        id: "prepare-embalagens",
        titulo: "Prepare as embalagens",
        resumo: "Retire resíduos sem desperdiçar água e reduza o volume quando for seguro.",
        conteudo: [
          "Esvazie as embalagens e retire o excesso de produto. Uma limpeza simples costuma ser suficiente; não é necessário esterilizar.",
          "Deixe recipientes secarem antes de guardar para evitar mau cheiro e umidade sobre papéis e papelões.",
          "Amasse latas, garrafas e caixas somente quando isso não criar pontas cortantes ou dificultar a identificação do material.",
        ],
      },
      {
        id: "armazene-com-seguranca",
        titulo: "Armazene com segurança",
        resumo: "Proteja materiais cortantes e mantenha tudo seco até a entrega.",
        conteudo: [
          "Vidros quebrados devem ser colocados em uma embalagem resistente e claramente identificada.",
          "Mantenha os recicláveis em local coberto, ventilado e protegido da chuva.",
          "Óleo de cozinha usado deve ficar em uma garrafa resistente, bem fechada e separada dos materiais secos.",
        ],
      },
      {
        id: "planeje-a-entrega",
        titulo: "Planeje a entrega",
        resumo: "Confirme materiais, quantidades, local e horário antes de sair.",
        conteudo: [
          "Cadastre as categorias e quantidades aproximadas para encontrar parceiros compatíveis.",
          "Leia as informações do perfil selecionado e confirme se ele recebe todos os materiais que você separou.",
          "Combine a entrega com clareza e fique atento aos convites e mensagens da plataforma.",
        ],
      },
    ],
  },
  {
    id: "como-identificar-materiais-reciclaveis",
    titulo: "Como identificar materiais recicláveis",
    nivel: "Iniciante",
    duracao: "25 min",
    icone: <FaSearch />,
    resumo: "Reconheça os materiais mais comuns e saiba quando confirmar o descarte.",
    aulas: [
      {
        id: "observe-o-material",
        titulo: "Observe o material, não apenas a embalagem",
        resumo: "Formato, composição e contaminação influenciam a possibilidade de reciclagem.",
        conteudo: [
          "Comece identificando do que o objeto é feito: papel, plástico, vidro, metal ou uma combinação de materiais.",
          "Símbolos e números ajudam na identificação, mas não garantem que o material seja aceito na sua região.",
          "Itens muito sujos, misturados ou difíceis de separar podem exigir orientação específica.",
        ],
      },
      {
        id: "papel-e-papelao",
        titulo: "Papel e papelão",
        resumo: "Priorize materiais secos, limpos e sem excesso de gordura.",
        conteudo: [
          "Caixas, jornais, folhas e embalagens de papel limpas costumam ter bom aproveitamento.",
          "Papéis engordurados, molhados, plastificados ou de uso sanitário geralmente não seguem a coleta reciclável comum.",
          "Retire restos de alimento e dobre caixas para economizar espaço, sem molhá-las.",
        ],
      },
      {
        id: "plasticos",
        titulo: "Plásticos",
        resumo: "Observe o tipo de resina e confirme a aceitação do parceiro.",
        conteudo: [
          "Garrafas, frascos e potes rígidos são facilmente reconhecidos, mas a aceitação varia conforme a estrutura de triagem local.",
          "O número dentro do símbolo triangular identifica a resina do plástico; ele não significa, sozinho, que o item será reciclado.",
          "Embalagens com várias camadas ou materiais inseparáveis precisam de confirmação antes da entrega.",
        ],
      },
      {
        id: "vidros-e-metais",
        titulo: "Vidros e metais",
        resumo: "Diferencie embalagens comuns de itens que exigem descarte especial.",
        conteudo: [
          "Garrafas e potes de vidro seguem processos diferentes de espelhos, cerâmicas, lâmpadas e vidros temperados.",
          "Latas de alumínio e aço costumam ser recicláveis quando vazias e sem excesso de resíduos.",
          "Proteja bordas e partes cortantes para preservar a segurança de quem realizará a coleta e a triagem.",
        ],
      },
      {
        id: "confirme-antes-de-descartar",
        titulo: "Na dúvida, confirme antes de descartar",
        resumo: "Use a lista de materiais aceitos e converse com o parceiro escolhido.",
        conteudo: [
          "Não coloque um item na coleta apenas porque ele parece reciclável. A aceitação depende do processo disponível no destino.",
          "Consulte o perfil do coletor ou centro e envie uma mensagem quando o material não estiver claramente listado.",
          "Se o item exigir logística reversa, procure pontos específicos indicados pelo fabricante ou pelo município.",
        ],
      },
    ],
  },
];

export const extras = [
  {
    id: "eventos",
    icone: <FaCalendarAlt />,
    titulo: "Organize uma campanha",
    texto: "Ideias para organizar mutirões e ações de conscientização.",
    descricao: "Use este roteiro para transformar uma ideia em uma ação simples e bem organizada.",
    topicos: [
      { titulo: "Defina um objetivo", texto: "Escolha o material, o período da campanha e uma meta fácil de comunicar." },
      { titulo: "Prepare o recebimento", texto: "Identifique os pontos de entrega e informe como os materiais devem chegar." },
      { titulo: "Compartilhe o resultado", texto: "Divulgue quanto foi coletado e qual destino recebeu os materiais." },
    ],
  },
  {
    id: "curiosidades",
    icone: <FaGlobeAmericas />,
    titulo: "Fatos sobre reciclagem",
    texto: "Informações rápidas para reciclar com mais consciência.",
    descricao: "Alguns detalhes simples ajudam a entender por que a preparação correta faz diferença.",
    topicos: [
      { titulo: "Limpo não significa esterilizado", texto: "Retirar restos de produto costuma ser suficiente; evite desperdiçar água tentando deixar a embalagem impecável." },
      { titulo: "Nem todo vidro segue a mesma rota", texto: "Espelhos, cerâmicas e lâmpadas exigem orientações diferentes das garrafas e dos potes." },
      { titulo: "Material seco preserva valor", texto: "Papéis molhados ou engordurados perdem qualidade e podem contaminar outros recicláveis." },
    ],
  },
  {
    id: "projetos",
    icone: <FaHandHoldingHeart />,
    titulo: "Encontre parceiros",
    texto: "Encontre coletores e centros compatíveis com seus materiais.",
    descricao: "A plataforma ajuda você a escolher um parceiro e combinar a destinação dos materiais cadastrados.",
    topicos: [
      { titulo: "Confira a compatibilidade", texto: "Veja quais materiais cada coletor ou centro recebe antes de enviar o convite." },
      { titulo: "Combine com clareza", texto: "Informe quantidades, localização e disponibilidade para evitar desencontros." },
      { titulo: "Acompanhe os convites", texto: "Depois do envio, fique atento às notificações e à área de convites." },
    ],
    cta: { label: "Encontrar parceiros", to: "/doacao/encontrar-parceiros" },
  },
  {
    id: "assistente",
    icone: <FaRobot />,
    titulo: "Dúvidas de descarte",
    texto: "Respostas rápidas para dúvidas comuns sobre reciclagem.",
    descricao: "Confira orientações rápidas antes de separar ou entregar um material.",
    topicos: [
      { titulo: "Preciso lavar as embalagens?", texto: "Esvazie e retire o excesso de resíduos. Uma limpeza simples costuma bastar e evita desperdício de água." },
      { titulo: "Como entregar vidro quebrado?", texto: "Proteja os pedaços em uma embalagem resistente e identifique claramente que há material cortante." },
      { titulo: "E se o material não estiver na lista?", texto: "Confirme diretamente com o coletor ou centro de reciclagem antes de levar o item." },
    ],
  },
];

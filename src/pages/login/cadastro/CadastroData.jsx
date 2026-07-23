export const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

const opcoesEstados = estadosBrasileiros.map((uf) => ({
  value: uf.sigla,
  label: `${uf.nome} (${uf.sigla})`,
}));

export const tiposInstituicao = [
  "Escola / Instituição de ensino",
  "Associação Comunitária",
  "Instituto Social",
  "Projeto Socioambiental",
  "Centro Comunitário",
  "Órgão Público (Secretarias de Educação ou Meio Ambiente)",
  "ONG / Organização Não Governamental",
];

const opcoesTiposInstituicao = tiposInstituicao.map((tipo) => ({
  value: tipo,
  label: tipo,
}));

const campoEstado = {
  name: "estado",
  label: "Estado",
  type: "select",
  placeholder: "Estado",
  required: true,
  size: "small",
  options: opcoesEstados,
};
const campoCidade = {
  name: "cidade",
  label: "Cidade",
  type: "select",
  placeholder: "Cidade",
  required: true,
  size: "small",
  dependsOn: "estado",
};



export const camposPorPerfil = {
  "pessoa-recicladora": [
    {
      titulo: "Dados pessoais",
      campos: [
        {
          name: "nome",
          label: "Nome completo",
          type: "text",
          placeholder: "Nome completo",
          required: true,
        },
        {
          name: "dataNascimento",
          label: "Data de nascimento",
          type: "date",
          placeholder: "dd/mm/aaaa",
          required: true,
          size: "small",
        },
        {
          name: "cpf",
          label: "CPF",
          type: "text",
          placeholder: "CPF",
          required: true,
          size: "small",
        },
      ],
    },
    {
      titulo: "Contato",
      campos: [
        {
          name: "email",
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
          required: true,
        },
        {
          name: "telefone",
          label: "Telefone",
          type: "tel",
          placeholder: "Telefone",
          required: true,
        },
      ],
    },
    {
      titulo: "Localização",
      campos: [
      campoEstado,
      campoCidade,
      ],
    },
  ],

  "coletor-autonomo": [
    {
      titulo: "Dados pessoais",
      campos: [
        {
          name: "nome",
          label: "Nome completo",
          type: "text",
          placeholder: "Nome completo",
          required: true,
        },
        {
          name: "dataNascimento",
          label: "Data de nascimento",
          type: "date",
          placeholder: "dd/mm/aaaa",
          required: true,
          size: "small",
        },
        {
          name: "cpf",
          label: "CPF",
          type: "text",
          placeholder: "CPF",
          required: true,
          size: "small",
        },
      ],
    },
    {
      titulo: "Contato",
      campos: [
        {
          name: "email",
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
          required: true,
        },
        {
          name: "telefone",
          label: "Telefone",
          type: "tel",
          placeholder: "Telefone",
          required: true,
        },
      ],
    },
    {
      titulo: "Atuação",
      campos: [
      campoEstado,
      campoCidade,
      ],
    },
  ],

  "instituicao-recicladora": [
    {
      titulo: "Dados da instituição",
      campos: [
        {
          name: "nome",
          label: "Nome da instituição",
          type: "text",
          placeholder: "Nome da instituição",
          required: true,
        },
        {
          name: "cnpj",
          label: "CNPJ",
          type: "text",
          placeholder: "CNPJ",
          required: true,
        },
        {
          name: "tipoInstituicao",
          label: "Tipo de instituição",
          type: "select",
          placeholder: "Selecione o tipo de instituição",
          required: true,
          options: opcoesTiposInstituicao,
        },
        {
          name: "representante",
          label: "Representante da Instituição",
          type: "text",
          placeholder: "Nome do Representante",
          required: true,
        },
      ],
    },
    {
      titulo: "Contato",
      campos: [
        {
          name: "email",
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
          required: true,
        },
        {
          name: "telefone",
          label: "Telefone",
          type: "tel",
          placeholder: "Telefone",
          required: true,
        },
      ],
    },
    {
      titulo: "Endereço",
      campos: [
        campoEstado,
        campoCidade,
      ],
    },
  ],

  "centro-coleta": [
    {
      titulo: "Dados do centro",
      campos: [
        {
          name: "nome",
          label: "Nome do centro",
          type: "text",
          placeholder: "Nome do centro",
          required: true,
        },
        {
          name: "cnpj",
          label: "CNPJ",
          type: "text",
          placeholder: "CNPJ",
          required: true,
        },
      ],
    },
    {
      titulo: "Contato",
      campos: [
        {
          name: "email",
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
          required: true,
        },
        {
          name: "telefone",
          label: "Telefone",
          type: "tel",
          placeholder: "Telefone",
          required: true,
        },
      ],
    },
    {
      titulo: "Endereço",
      campos: [
        campoEstado, 
        campoCidade,
      ],
    },
  ],
};

export const perfilInfo = {
  "pessoa-recicladora": {
    label: "Pessoa Recicladora",
  },
  "coletor-autonomo": {
    label: "Coletor Autônomo",
  },
  "instituicao-recicladora": {
    label: "Instituição Recicladora",
  },
  "centro-coleta": {
    label: "Centro de Reciclagem",
  },
};
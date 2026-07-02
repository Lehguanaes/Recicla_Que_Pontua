export const camposPorPerfil = {
  "pessoa-recicladora": [
    {
      titulo: "Dados pessoais",
      campos: [
        { name: "nome",      label: "Nome completo",      type: "text",  placeholder: "Nome completo", required: true },
        { name: "data_nasc", label: "Data de nascimento", type: "date",  placeholder: "dd/mm/aaaa",     required: true, size: "small" },
        { name: "cpf",       label: "CPF",                type: "text",  placeholder: "CPF",  required: true, size: "small" },
      ],
    },
    {
      titulo: "Contato",
      campos: [
        { name: "email",    label: "E-mail",   type: "email", placeholder: "Email",    required: true },
        { name: "telefone", label: "Telefone", type: "tel",   placeholder: "Telefone", required: false },
      ],
    },
    {
      titulo: "Localização",
      campos: [
        { name: "cidade", label: "Cidade", type: "text", placeholder: "Cidade", required: true, size: "small" },
        { name: "estado", label: "Estado", type: "text", placeholder: "Estado", required: true, size: "small" },
      ],
    },
  ],

  "catador-autonomo": [
    {
      titulo: "Dados pessoais",
      campos: [
        { name: "nome", label: "Nome completo", type: "text", placeholder: "Nome completo", required: true },
        { name: "data_nasc", label: "Data de nascimento", type: "date",  placeholder: "dd/mm/aaaa",     required: true, size: "small" },
        { name: "cpf",       label: "CPF",                type: "text",  placeholder: "CPF",  required: true, size: "small" },

      ],
    },
    {
      titulo: "Contato",
      campos: [
        { name: "email",    label: "E-mail",   type: "email", placeholder: "Email",  required: true },
        { name: "telefone", label: "Telefone", type: "tel",   placeholder: "Telefone",  required: true },
      ],
    },
    {
      titulo: "Atuação",
      campos: [
        { name: "cidade", label: "Cidade", type: "text", placeholder: "Cidade", required: true, size: "small" },
        { name: "estado", label: "Estado", type: "text", placeholder: "Estado", required: true, size: "small" },
      ],
    },
  ],

  "instituicao-recicladora": [
    {
      titulo: "Dados da instituição",
      campos: [
        { name: "nome", label: "Nome da instituição", type: "text", placeholder: "Nome da instituição", required: true },
        { name: "cnpj", label: "CNPJ", type: "text", placeholder: "CNPJ",  required: true},
      ],
    },
    {
      titulo: "Contato",
      campos: [
        { name: "email", label: "E-mail", type: "email", placeholder: "Email", required: true },
      ],
    },
    {
      titulo: "Endereço",
      campos: [
        { name: "cidade", label: "Cidade", type: "text", placeholder: "Cidade", required: true, size: "small" },
        { name: "estado", label: "Estado", type: "text", placeholder: "Estado", required: true, size: "small" },
      ],
    },
  ],

  "centro-coleta": [
    {
      titulo: "Dados do centro",
      campos: [
        { name: "nome", label: "Nome do centro", type: "text", placeholder: "Nome da organização", required: true },
        { name: "cnpj", label: "CNPJ", type: "text", placeholder: "CNPJ",   required: true },
      ],
    },
    {
      titulo: "Contato",
      campos: [
        { name: "email", label: "E-mail", type: "email", placeholder: "Email", required: true },
      ],
    },
    {
      titulo: "Endereço",
      campos: [
        { name: "cidade", label: "Cidade", type: "text", placeholder: "Cidade", required: true, size: "small" },
        { name: "estado", label: "Estado", type: "text", placeholder: "Estado", required: true, size: "small" },
      ],
    },
  ],
};

export const perfilInfo = {
  "pessoa-recicladora":      { label: "Pessoa Recicladora"     },
  "catador-autonomo":        { label: "Catador Autônomo"       },
  "instituicao-recicladora": { label: "Instituição Recicladora" },
  "centro-coleta":           { label: "Centro de Reciclagem"   },
};

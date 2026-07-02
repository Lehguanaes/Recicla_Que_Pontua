

export const camposPorPerfil = {
  "pessoa-recicladora": [
    { name: "nome",     label: "Nome completo", type: "text",  placeholder: "Ex: João Silva",  required: true  },
    { name: "email",    label: "E-mail",        type: "email", placeholder: "joao@email.com",  required: true  },
    { name: "telefone", label: "Telefone",      type: "tel",   placeholder: "(11) 99999-9999", required: false },
    { name: "cidade",   label: "Cidade",        type: "text",  placeholder: "Ex: São Paulo",   required: true  },
  ],
  "catador-autonomo": [
    { name: "nome",     label: "Nome completo",     type: "text",  placeholder: "Ex: Maria Silva", required: true },
    { name: "email",    label: "E-mail",            type: "email", placeholder: "maria@email.com", required: true },
    { name: "telefone", label: "Telefone",          type: "tel",   placeholder: "(11) 99999-9999", required: true },
    { name: "regiao",   label: "Região de atuação", type: "text",  placeholder: "Ex: Zona Norte",  required: true },
  ],
  "instituicao-recicladora": [
    { name: "nome",   label: "Nome da instituição", type: "text",  placeholder: "Ex: Instituto Verde", required: true },
    { name: "cnpj",   label: "CNPJ",               type: "text",  placeholder: "00.000.000/0001-00",   required: true },
    { name: "email",  label: "E-mail",             type: "email", placeholder: "contato@inst.com",     required: true },
    { name: "cidade", label: "Cidade",             type: "text",  placeholder: "Ex: São Paulo",        required: true },
  ],
  "centro-coleta": [
    { name: "nome",     label: "Nome do centro", type: "text",  placeholder: "Ex: Ecoponto Central", required: true },
    { name: "cnpj",     label: "CNPJ",           type: "text",  placeholder: "00.000.000/0001-00",    required: true },
    { name: "email",    label: "E-mail",         type: "email", placeholder: "ecoponto@email.com",   required: true },
    { name: "endereco", label: "Endereço",       type: "text",  placeholder: "Rua, número, bairro",  required: true },
  ],
};

export const perfilInfo = {
  "pessoa-recicladora":     { label: "Pessoa Recicladora"    },
  "catador-autonomo":       { label: "Catador Autônomo"      },
  "instituicao-recicladora":{ label: "Instituição Recicladora"},
  "centro-coleta":          { label: "Centro de Reciclagem"  },
};
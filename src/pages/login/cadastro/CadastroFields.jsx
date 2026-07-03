import  { maskCPF, maskCNPJ, maskTelefone } from '../../../auth/Formatters';

const mascaras = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  telefone: maskTelefone,
};

export default function CadastroFields({
  secoes,
  formData,
  errors,
  setFormData,
  setErrors,
}) {
  function handleChange(campo, rawValue) {
    const aplicarMascara = mascaras[campo.name];
    const valor = aplicarMascara ? aplicarMascara(rawValue) : rawValue;

    setFormData((prev) => ({
      ...prev,
      [campo.name]: valor,
    }));

    setErrors((prev) => ({
      ...prev,
      [campo.name]: undefined,
    }));
  }

  return (
    <div className="cadastro-fields">
      {secoes.map((secao) => (
        <div key={secao.titulo} className="cadastro-secao">
          <h3 className="secao-titulo">{secao.titulo}</h3>

          <div className="secao-grid">
            {secao.campos.map((campo) => (
              <div
                key={campo.name}
                className={`input-group ${campo.size === "small" ? "small" : "full"}`}
              >
                <input
                  type={campo.type}
                  placeholder={campo.placeholder}
                  value={formData[campo.name] || ""}
                  className={errors[campo.name] ? "error" : ""}
                  inputMode={
                    ["cpf", "cnpj", "telefone", "cep"].includes(campo.name)
                      ? "numeric"
                      : undefined
                  }
                  onChange={(e) => handleChange(campo, e.target.value)}
                />

                {errors[campo.name] && (
                  <span className="form-error">
                    {errors[campo.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

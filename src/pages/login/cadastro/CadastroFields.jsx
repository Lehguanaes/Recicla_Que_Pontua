export default function CadastroFields({
  secoes,
  formData,
  errors,
  setFormData,
  setErrors,
}) {
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
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [campo.name]: e.target.value,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      [campo.name]: undefined,
                    }));
                  }}
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

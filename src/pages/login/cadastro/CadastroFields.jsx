


export default function CadastroFields({
  campos,
  formData,
  errors,
  setFormData,
  setErrors,
}) {
  return (
    <>
      {campos.map((campo) => (
        <div className="input-group" key={campo.name}>
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
    </>
  );
}
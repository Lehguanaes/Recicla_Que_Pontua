import FormField from "./FormField";
import Input from "./Input";

export default function InputField({
  id,
  label,
  hint,
  error,
  fieldClassName = "",
  labelClassName = "",
  hintClassName = "",
  errorClassName = "",
  className = "",
  ...inputProps
}) {
  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={fieldClassName}
      labelClassName={labelClassName}
      hintClassName={hintClassName}
      errorClassName={errorClassName}
    >
      <Input
        id={id}
        className={className}
        invalid={Boolean(error)}
        {...inputProps}
      />
    </FormField>
  );
}

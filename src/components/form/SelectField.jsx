import { useEffect, useRef, useState } from "react";
import "./form.css";

export default function SelectField({
  value,
  placeholder,
  options,
  disabled = false,
  error = false,
  onChange,
  native = false,
  label,
  id,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (native) {
    const nativeSelect = (
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

    if (!label && !className) {
      return nativeSelect;
    }

    return (
      <label className={className} htmlFor={id}>
        {label && <span>{label}</span>}
        {nativeSelect}
      </label>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select${open ? " is-open" : ""}${error ? " error" : ""}${disabled ? " is-disabled" : ""}`}
    >
      <button
        type="button"
        className={`custom-select-trigger${selectedOption ? "" : " is-placeholder"}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span className="custom-select-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="custom-select-menu" role="listbox">
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`custom-select-option${option.value === value ? " selected" : ""}`}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

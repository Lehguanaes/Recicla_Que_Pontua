export default function Thumb({ icone, cor = "a", size = "md" }) {
  return (
    <div
      className={`comunidade-thumb comunidade-thumb-${cor} comunidade-thumb-${size}`}
      aria-hidden="true"
    >
      {icone}
    </div>
  );
}
import "./button.css";

export default function Button({ href = "/login" }) {
  return (
    <a href={href} className="button">
    </a>
  );
}

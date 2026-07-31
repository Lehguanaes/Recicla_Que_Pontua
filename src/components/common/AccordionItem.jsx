import { cloneElement, isValidElement, useState } from "react";

export default function AccordionItem({
  question,
  answer,
  open,
  onToggle,
  icon,
  className = "",
  openClassName = "",
  buttonClassName = "",
  iconClassName = "",
  panelClassName = "",
  panelInnerClassName = "",
  answerClassName = "",
  wrapQuestion = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : internalOpen;

  function handleToggle() {
    if (onToggle) onToggle();
    if (!isControlled) setInternalOpen((current) => !current);
  }

  return (
    <div className={`${className}${isOpen && openClassName ? ` ${openClassName}` : ""}`}>
      <button
        type="button"
        className={buttonClassName}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        {wrapQuestion ? <span>{question}</span> : question}
        {icon &&
          (isValidElement(icon)
            ? cloneElement(icon, {
                className: [icon.props.className, iconClassName]
                  .filter(Boolean)
                  .join(" "),
              })
            : icon)}
      </button>

      <div className={panelClassName}>
        <div className={panelInnerClassName}>
          <p className={answerClassName || undefined}>{answer}</p>
        </div>
      </div>
    </div>
  );
}

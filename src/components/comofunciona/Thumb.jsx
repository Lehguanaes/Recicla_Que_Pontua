export default function Thumb({ icone, cor = "a", size = "md" }) {
  return (
    <div
      className={`comunidade-thumb comunidade-thumb-${cor} comunidade-thumb-${size}`}
      aria-hidden="true"
    >
      {icone}

      <style>
      {`
        .comunidade-thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
          color: var(--color-brand-green-dark, var(--color-brand-green-deep));
        }
        
        .comunidade-thumb-a {
          background: rgb(var(--rgb-brand-green) / 0.15);
        }
        
        .comunidade-thumb-b {
          background: rgb(var(--rgb-brand-green-deep) / 0.12);
        }
        
        .comunidade-thumb-c {
          background: var(--color-highlight-green);
        }
        
        .comunidade-thumb-sm {
          width: 48px;
          height: 48px;
          font-size: 1.2rem;
          border-radius: 10px;
        }
        
        .comunidade-thumb-md {
          width: 100%;
          height: 100%;
          font-size: 1.8rem;
        }
        
        .comunidade-thumb-lg {
          width: 100%;
          height: 100%;
          min-height: 180px;
          font-size: 2.6rem;
          border-radius: 16px;
        }
    `}
    </style>
    </div>
  );
}
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
          color: var(--secondary-dark, #2e7d32);
        }
        
        .comunidade-thumb-a {
          background: rgba(76, 175, 80, 0.15);
        }
        
        .comunidade-thumb-b {
          background: rgba(46, 125, 50, 0.12);
        }
        
        .comunidade-thumb-c {
          background: rgba(129, 199, 132, 0.22);
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
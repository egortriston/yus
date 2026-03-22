interface HintProps {
  text: string;
}

export function Hint({ text }: HintProps) {
  return (
    <span className="hint" tabIndex={0}>
      <span className="hint-trigger" aria-label="Подсказка">
        ?
      </span>
      <span className="hint-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}

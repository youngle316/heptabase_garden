import katex from "katex";
import { useEffect, useRef } from "react";

interface MathRendererProps {
  formula: string;
  inline?: boolean;
  className?: string;
}

export default function MathRenderer({
  formula,
  inline = false,
  className = "",
}: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = inline ? spanRef.current : containerRef.current;

    if (element && formula) {
      try {
        katex.render(formula, element, {
          displayMode: !inline,
          throwOnError: false,
          output: "html",
        });
      } catch {
        element.textContent = inline ? `$${formula}$` : `$$${formula}$$`;
      }
    }
  }, [formula, inline]);

  const baseClass = inline ? "math-inline" : "math-display";

  if (inline) {
    return (
      <span
        ref={spanRef}
        className={`${baseClass} ${className}`}
        data-type="math"
        data-formula={formula}
      >
        {`$${formula}$`}
      </span>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${baseClass} ${className}`}
      data-type="math"
      data-formula={formula}
    >
      {`$$${formula}$$`}
    </div>
  );
}

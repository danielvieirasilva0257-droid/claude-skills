"use client";

// HoldToConfirm: segure para confirmar uma ação destrutiva (ex.: "Excluir").
// Escrito para a skill button-animation (11/10/2026). Receita de origem:
// Emil Kowalski, emilkowalski/skills, skills/animate/RECIPES.md, "Hold to confirm" (MIT):
// preenchimento com clip-path, 2 s linear ao segurar e 200 ms ease-out ao soltar
// ("lento onde o usuário decide, rápido onde o sistema responde").
// O CSS puro do Emil só desenha o preenchimento; aqui um timer dispara a ação de verdade,
// e o teclado (Enter/Espaço segurados) também funciona.

import * as React from "react";

export type HoldToConfirmProps = {
  onConfirm: () => void;
  children: React.ReactNode;
  /** Tempo segurando até confirmar (ms). */
  holdMs?: number;
  className?: string;
};

export function HoldToConfirm({ onConfirm, children, holdMs = 2000, className = "" }: HoldToConfirmProps) {
  const [holding, setHolding] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onConfirm();
    }, holdMs);
  };
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  React.useEffect(() => cancel, []);

  return (
    <button
      type="button"
      aria-label={`Segure para confirmar: ${typeof children === "string" ? children : ""}`.trim()}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={cancel}
      onBlur={cancel}
      onContextMenu={(e) => e.preventDefault()}
      className={[
        "relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl px-5",
        "bg-red-50 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300",
        "touch-manipulation select-none [-webkit-tap-highlight-color:transparent]",
        "transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
        holding ? "scale-[0.97]" : "",
        "outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
    >
      <span className="relative">{children}</span>
      {/* Preenchimento: o recorte é a própria borda do botão (borda real), então é permitido. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-600 text-white"
        style={{
          clipPath: holding ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: holding
            ? `clip-path ${holdMs}ms linear`
            : "clip-path 200ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {children}
      </span>
    </button>
  );
}

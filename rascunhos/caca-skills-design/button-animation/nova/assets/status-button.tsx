"use client";

// StatusButton: botão com 4 estados (idle → loading → success | error).
// Escrito para a skill button-animation (11/10/2026). Ideias e números de:
// - Jakub Krehel, jakubkrehel/skills (MIT): troca de ícone com opacity + scale + blur 4px,
//   mola sem quique, enabled:active:scale-[0.96], "o movimento nunca é o único sinal".
// - Vercel Web Interface Guidelines (MIT): atraso para mostrar o spinner (~150–300 ms)
//   e tempo mínimo visível (~300–500 ms); manter o rótulo com reticências.
// - Animata status-button e wshobson interaction-design (MIT): a ideia do botão de estados.
// - Emil Kowalski, emilkowalski/skills (MIT): nunca entrar de scale(0), curva ease-out forte.
// O código é nosso; nada foi colado literalmente das fontes.
// Requer Tailwind 4 (a escala do toque usa a propriedade CSS `scale`, separada do
// `transform` que o Motion usa para o tremor de erro). No Tailwind 3, troque o toque por
// whileTap={{ scale: 0.96 }} no próprio motion.button.

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type StatusButtonState = "idle" | "loading" | "success" | "error";

export type StatusButtonProps = {
  /** Ação assíncrona. Resolver = sucesso; lançar erro = erro. */
  action: () => Promise<unknown>;
  children: React.ReactNode;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  /** Quanto tempo o estado final fica na tela antes de voltar a idle (ms). */
  resetAfter?: number;
  /** Atraso antes de mostrar o spinner, para respostas rápidas não piscarem (ms). */
  showDelay?: number;
  /** Tempo mínimo que o spinner fica visível depois de aparecer (ms). */
  minLoading?: number;
  /** Desliga a escala do toque (onde ela distrai). */
  static?: boolean;
  disabled?: boolean;
  className?: string;
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const swap = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
};
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function Spinner() {
  return (
    <svg className="size-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function StatusButton({
  action,
  children,
  loadingLabel = "Salvando…",
  successLabel = "Salvo",
  errorLabel = "Tente de novo",
  resetAfter = 2000,
  showDelay = 200,
  minLoading = 400,
  static: isStatic = false,
  disabled,
  className = "",
}: StatusButtonProps) {
  const reduce = useReducedMotion();
  const [state, setState] = React.useState<StatusButtonState>("idle");
  const [busy, setBusy] = React.useState(false);
  const mounted = React.useRef(true);
  React.useEffect(() => () => { mounted.current = false; }, []);

  const run = async () => {
    if (busy) return; // evita duplo envio
    setBusy(true);
    let shownAt = 0;
    const timer = setTimeout(() => {
      shownAt = performance.now();
      if (mounted.current) setState("loading");
    }, showDelay);
    let next: StatusButtonState = "success";
    try {
      await action();
    } catch {
      next = "error";
    }
    clearTimeout(timer);
    if (shownAt) {
      const left = minLoading - (performance.now() - shownAt);
      if (left > 0) await wait(left);
    }
    if (!mounted.current) return;
    setState(next);
    await wait(resetAfter);
    if (!mounted.current) return;
    setState("idle");
    setBusy(false);
  };

  const variants = reduce ? fade : swap;
  const content =
    state === "loading" ? (
      <>
        <Spinner />
        {loadingLabel}
      </>
    ) : state === "success" ? (
      <>
        <Check />
        {successLabel}
      </>
    ) : state === "error" ? (
      <>
        <Cross />
        {errorLabel}
      </>
    ) : (
      children
    );

  const tone =
    state === "success"
      ? "bg-emerald-600 text-white"
      : state === "error"
        ? "bg-red-600 text-white"
        : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100";

  return (
    <motion.button
      type="button"
      onClick={run}
      disabled={disabled}
      aria-disabled={busy || undefined}
      aria-busy={state === "loading" || undefined}
      // Erro: um "não" curto, 4 px, uma vez só. Sem deslocamento em movimento reduzido.
      animate={state === "error" && !reduce ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "relative inline-flex h-10 min-w-40 items-center justify-center overflow-hidden rounded-xl px-5",
        "text-sm font-semibold shadow-sm touch-manipulation select-none",
        "[-webkit-tap-highlight-color:transparent]",
        "transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isStatic || busy ? "" : "enabled:active:scale-[0.96]",
        "outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
        "disabled:pointer-events-none disabled:opacity-40",
        tone,
        className,
      ].join(" ")}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          {...variants}
          transition={reduce ? { duration: 0.12 } : { type: "spring", visualDuration: 0.25, bounce: 0 }}
          className="inline-flex items-center gap-2"
        >
          {content}
        </motion.span>
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "success" ? successLabel : state === "error" ? errorLabel : ""}
      </span>
    </motion.button>
  );
}

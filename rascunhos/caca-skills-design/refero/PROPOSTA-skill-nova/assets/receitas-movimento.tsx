// Receitas de movimento para sites premium (skill estilos-premium).
// Testado em 11/10/2026: TypeScript estrito, motion@14.0.0, React 18. Tailwind v4 nas classes.
// Todas seguem as 4 regras de composição do editor (veja references/movimento-sites.md).
"use client";
import { useState } from "react";
import {
  motion, AnimatePresence, MotionConfig, stagger, useScroll, useMotionValueEvent,
  type Variants,
} from "motion/react";

// ---------- Tokens de curva (arrays para o Motion) ----------
export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  outQuint: [0.22, 1, 0.36, 1],
  outExpo: [0.19, 1, 0.22, 1],
  drawer: [0.32, 0.72, 0, 1],
  weighted: [0.52, 0.01, 0, 1],
} as const;

// ---------- M1. Envolver o app: respeita "reduzir movimento" ----------
export function App({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// ---------- M2. Revelação ao rolar, disparada na borda de baixo (regra 4) ----------
const subir: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.outQuint, delay: Math.min(i, 4) * 0.075 },
  }),
};
export function ListaQueSobe({ itens }: { itens: { id: string; titulo: string }[] }) {
  return (
    <ul className="grid gap-6">
      {itens.map((it, i) => (
        <motion.li key={it.id} custom={i} variants={subir} initial="hidden" whileInView="show"
          viewport={{ once: true }}>
          {it.titulo}
        </motion.li>
      ))}
    </ul>
  );
}

// ---------- M3. Hero calmo: o texto já está lá; o produto sobe da borda de baixo ----------
export function HeroCalmo({ src, alt }: { src: string; alt: string }) {
  return (
    <section className="relative flex min-h-svh flex-col items-center overflow-x-clip pt-40 text-center">
      <h1 className="relative z-10 max-w-[16ch] text-balance text-[clamp(2.5rem,5vw+1rem,5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
        Título do produto
      </h1>
      <p className="relative z-10 mt-4 text-[17px] text-neutral-600">Uma frase curta.</p>
      <motion.img src={src} alt={alt} className="relative z-20 mt-12 w-[min(90vw,960px)]"
        initial={{ y: "60vh" }} animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: EASE.outExpo }} />
    </section>
  );
}

// ---------- M4. Hero coreografado: cada camada entra de uma borda da janela ----------
const palco: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.075, { startDelay: 0.6 }) } },
};
const doTopo: Variants = {
  hidden: { y: "-100%" },
  show: { y: 0, transition: { duration: 1, ease: EASE.outExpo } },
};
const daEsquerda: Variants = {
  hidden: { x: "-100vw" },
  show: { x: 0, transition: { duration: 1.2, ease: EASE.outExpo } },
};
const daDireita: Variants = {
  hidden: { x: "100vw" },
  show: { x: 0, transition: { duration: 1.2, ease: EASE.outExpo } },
};
export function HeroCoreografado() {
  return (
    <motion.section variants={palco} initial="hidden" animate="show"
      className="relative min-h-svh overflow-x-clip">
      <motion.nav variants={doTopo} className="fixed inset-x-0 top-0 z-30 h-14 bg-white/85 backdrop-blur-xl">…</motion.nav>
      <div className="relative z-10 pt-40">
        <motion.h1 variants={daEsquerda} className="block">Primeira linha</motion.h1>
        <motion.h1 variants={daEsquerda} className="block">Segunda linha</motion.h1>
        <motion.div variants={daDireita}><a href="#comprar">Comprar</a></motion.div>
      </div>
    </motion.section>
  );
}

// ---------- M5. Texto que "rola" dentro de um botão com fundo visível (regra 2: borda real) ----------
const ROLA = [0.86, 0, 0.07, 1] as const; // power4.inOut
const ALTURA = 44; // igual a h-11: cada letra percorre a altura inteira do botão
export function BotaoQueRola({ rotulo }: { rotulo: string }) {
  const letras = [...rotulo];
  const n = letras.length;
  return (
    <motion.button type="button" aria-label={rotulo} initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }}
      className="relative inline-flex h-11 items-center overflow-hidden rounded-full bg-neutral-950 px-6 text-[15px] font-medium text-white">
      {letras.map((c, i) => {
        const t = { duration: 0.5, ease: ROLA, delay: ((i * 7) % n) * 0.03 }; // ordem "aleatória" estável
        const ch = c === " " ? "\u00a0" : c;
        return (
          <span key={i} aria-hidden className="relative inline-block">
            <motion.span className="inline-block" variants={{ rest: { y: 0 }, hover: { y: -ALTURA } }} transition={t}>{ch}</motion.span>
            <motion.span className="absolute left-0 top-0 inline-block" variants={{ rest: { y: ALTURA }, hover: { y: 0 } }} transition={t}>{ch}</motion.span>
          </span>
        );
      })}
    </motion.button>
  );
}

// ---------- M6. Barra de cima que vira vidro ao rolar (regra 1) ----------
export function BarraDeVidro({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const [solida, setSolida] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolida(y > 8));
  return (
    <header data-solida={solida}
      className="sticky top-0 z-30 h-11 border-b border-transparent transition-[background-color,border-color] duration-200
        data-[solida=true]:border-black/10 data-[solida=true]:bg-white/85 data-[solida=true]:backdrop-blur-xl data-[solida=true]:backdrop-saturate-[1.8]">
      {children}
    </header>
  );
}

// ---------- M7. Diálogo e gaveta ----------
export function Dialogo({ aberto, children }: { aberto: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {aberto && (
        <div key="dialogo" className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div role="dialog" aria-modal="true"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md rounded-[28px] bg-white p-8">
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export function Gaveta({ aberta, children }: { aberta: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {aberta && (
        <motion.aside key="gaveta" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: EASE.drawer }}
          className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white p-6">
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ---------- M8. Troca de página com View Transitions ----------
export function navegar(ir: () => void) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return ir();
  document.startViewTransition(ir);
}

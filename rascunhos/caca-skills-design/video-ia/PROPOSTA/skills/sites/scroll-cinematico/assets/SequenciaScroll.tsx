'use client';
// Sequência de quadros num <canvas> preso (sticky), controlada pela rolagem. Next.js + Motion 14 (motion/react).
// Mesma lógica do assets/scroll-sequencia.html. Testado em 11/10/2026: tsc --strict (Motion 14.1.0, React 19.3) e
// teste de fumaça no Chromium (bundle esbuild, 60 quadros): quadro certo, pôster some, textos A e B nas faixas,
// "reduzir movimento" sem canvas. Ainda não rodou dentro de um app Next.js de verdade nem num celular.
//
// Uso (quadros em public/seq/{d,m}/f_0001.webp, gerados por scripts/preparar-quadros.sh):
//   const celular = useMediaQuery('(max-width: 700px)'); // escolha o conjunto ANTES de montar
//   <SequenciaScroll total={120} padrao={(i) => `/seq/${celular ? 'm' : 'd'}/f_${String(i + 1).padStart(4, '0')}.webp`}
//     poster="/seq/d/poster.webp" alt="Garrafa girando até ficar de frente"
//     textoA={<><h2>Gira.</h2><p>…</p></>} textoB={<strong>120 quadros</strong>} />
// Para trocar de conjunto depois de montado (girou o celular), mude a `key` do componente.
// O pôster também vai como <link rel="preload" as="image" fetchpriority="high"> no <head> (é o LCP).
import {useEffect, useRef, type ReactNode} from 'react';
import {
  motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from 'motion/react';

type Props = {
  total: number;
  padrao: (i: number) => string; // i começa em 0
  poster: string;
  alt: string;
  textoA: ReactNode; // entra pela borda esquerda e sai por ela
  textoB: ReactNode; // sai de trás do produto (centro) para a direita; deve caber dentro do produto
  telas?: number; // comprimento da seção em telas (padrão 4 = 300vh de pin)
};

export function SequenciaScroll({total, padrao, poster, alt, textoA, textoB, telas = 4}: Props) {
  const secao = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<(HTMLImageElement | undefined)[]>([]);
  const desenhado = useRef(-1);
  const posterRef = useRef<HTMLImageElement>(null);
  const reduzir = useReducedMotion();
  const perto = useInView(secao, {margin: '200% 0px', once: true}); // carrega a 2 telas de distância

  const {scrollYProgress} = useScroll({target: secao, offset: ['start start', 'end end']});
  // Mola sem overshoot: quadros e textos usam o MESMO valor suavizado (senão descolam).
  const p = useSpring(scrollYProgress, {stiffness: 200, damping: 40, restDelta: 0.0005});

  const desenhar = (v: number, forcar = false) => {
    const c = cv.current;
    if (!c) return;
    const alvo = Math.round(v * (total - 1));
    const L = imgs.current;
    let i = -1;
    for (let d = 0; d < total; d++) { // o mais próximo já carregado
      if (L[alvo - d]) { i = alvo - d; break; }
      if (L[alvo + d]) { i = alvo + d; break; }
    }
    if (i < 0 || (i === desenhado.current && !forcar)) return; // só redesenha quando o quadro muda
    const im = L[i]!;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const s = Math.min(c.width / im.naturalWidth, c.height / im.naturalHeight); // "contain"
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(im, (c.width - w) / 2, (c.height - h) / 2, w, h);
    desenhado.current = i;
    if (posterRef.current) posterRef.current.style.visibility = 'hidden'; // os quadros têm alpha: o pôster não pode ficar atrás
  };
  useMotionValueEvent(p, 'change', (v) => desenhar(v));

  useEffect(() => { // pré-carrega grosso → fino (passos 8, 4, 2, 1), 6 de cada vez, decode() antes de usar
    if (reduzir || !perto) return;
    let vivo = true, q = 0;
    imgs.current = [];
    const ordem = [0, total - 1];
    for (const s of [8, 4, 2, 1]) for (let i = 0; i < total; i += s) if (!ordem.includes(i)) ordem.push(i);
    const prox = () => {
      if (!vivo || q >= ordem.length) return;
      const i = ordem[q++], im = new Image();
      im.src = padrao(i);
      im.decode()
        .then(() => { if (vivo) { imgs.current[i] = im; desenhar(p.get(), true); } })
        .catch(() => {})
        .finally(prox);
    };
    for (let k = 0; k < 6; k++) prox();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, reduzir, perto]);

  useEffect(() => { // tamanho do canvas só no resize (nunca no scroll); DPR no máximo 2
    const c = cv.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * d);
      c.height = Math.round(c.clientHeight * d);
      desenhar(p.get(), true);
    });
    ro.observe(c);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduzir]);

  // Textos em faixas de progresso que NÃO se sobrepõem (regra 1); só transform e opacity.
  // A: entra 0,06–0,22 (da borda, regra 4), parado até 0,40 (tempo de leitura), sai 0,40–0,50.
  // B: entra 0,78–0,92, saindo de trás do produto (camada abaixo do canvas, regra 3).
  const xA = useTransform(p, [0.06, 0.22, 0.4, 0.5], ['-100vw', '0vw', '0vw', '-100vw']);
  const xB = useTransform(p, [0.78, 0.92], ['0vw', '26vw']);
  const oB = useTransform(p, (v) => (v > 0.78 ? 1 : 0));

  if (reduzir) {
    // Reduzir movimento: versão parada (não "mais lenta"): pôster + textos lado a lado, sem pin.
    return (
      <section className="grid items-center gap-6 px-4 py-12 md:grid-cols-[1fr_auto_1fr]">
        <div>{textoA}</div>
        <img src={poster} alt={alt} className="mx-auto max-h-[80vh] w-auto" />
        <div>{textoB}</div>
      </section>
    );
  }

  return (
    <section ref={secao} style={{height: `${telas * 100}lvh`, position: 'relative'}}>
      <div style={{position: 'sticky', top: 0, height: '100svh', overflow: 'clip'}}>
        {/* Sem JS (antes da hidratação), o pôster aparece; o canvas cobre-o depois. */}
        <img ref={posterRef} src={poster} alt="" aria-hidden style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 0}} />
        {/* A caixa externa centraliza (CSS puro); a interna anda (Motion). */}
        <div style={{position: 'absolute', left: '6vw', top: '50%', transform: 'translateY(-50%)', maxWidth: '30vw', zIndex: 1}}>
          <motion.div style={{x: xA}}>{textoA}</motion.div>
        </div>
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1}}>
          <motion.div style={{x: xB, opacity: oB}}>{textoB}</motion.div>
        </div>
        <canvas ref={cv} role="img" aria-label={alt}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none'}} />
      </div>
    </section>
  );
}

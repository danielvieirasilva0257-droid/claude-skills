# Rotina: vídeo explicativo (Remotion)

Vídeo vertical 1080×1920, 30 fps, 10 s, apresentando o app **Rotina**: Hábitos, Treinos e Financeiro.

## Roteiro

| Tempo | Cena |
|---|---|
| 0,0–1,7 s | Abertura: logo "ROTINA" entra letra por letra, com desfoque, e a frase "Hábitos, treino e dinheiro. Num só app." |
| 1,2–2,3 s | O celular entra de baixo com inclinação 3D |
| 1,7–3,9 s | **01 Hábitos**: checklist sendo marcado, anel 4/5 e sequência sobe para 12 dias |
| 3,9–6,3 s | Giro rápido de câmera (whip pan) até **02 Treinos**: sugestão "+2,5 kg", carga sobe e gráfico de evolução com recorde |
| 6,3–8,5 s | Whip até **03 Financeiro**: saldo contando, cartão Nubank entrando e barras de orçamento |
| 8,5–10 s | Encerramento: logo, "Sua rotina inteira em um só app." e as três áreas |

## Técnicas "After Effects"

- **Suavização:** curvas bezier `expo out` (0.16, 1, 0.3, 1) e `ease in-out` forte nos whips, mais `spring()` nos "pops".
- **Desfoque de movimento:** `CameraMotionBlur` (`@remotion/motion-blur`), com 10 amostras e obturador de 200°.
- **Texto:** letras entram com blur e deslocamento escalonados.
- **Câmera:** parallax em rotateY e um leve "punch-out" de escala durante os whips.
- **Acabamento:** granulação de filme e vinheta. A granulação também elimina as faixas do gradiente.

## Design

Mesma identidade do app: fundo #080808, vermelho #CC0000/#FF5A5A, Barlow e Barlow Condensed (embutidas em `public/fonts`), cards #151515 com borda #262626. As telas do celular são recriadas em React a partir do app real, então ficam nítidas em qualquer resolução.

## Comandos

```bash
npm install
npm run studio   # pré-visualizar e ajustar
npm run render   # gera out/rotina.mp4
```

Para mudar a duração ou o tempo das cenas, edite o objeto `T` em `src/Main.tsx`. Os textos das legendas também estão nesse arquivo, e as telas ficam em `src/screens/`.

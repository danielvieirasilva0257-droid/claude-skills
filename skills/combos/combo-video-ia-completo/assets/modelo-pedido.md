# Modelo de pedido estruturado para um vídeo inteiro

Baseado no pedido real mostrado no vídeo "skill vídeo claude" (10/11/2026): um pedido só, com etiquetas, que produziu um vídeo de 7min35s. Preencha os campos `[…]`, apague o que não usar e mande para o Claude junto com o `combo-video-ia-completo`.

```text
<objetivo>
  1. Pesquise as melhores referências e técnicas para este vídeo: [tema].
  2. Decida como usar as skills do repositório (combo-video-ia-completo) para este trabalho.
  3. Faça de ponta a ponta (roteiro, narração, motion, som, edição, render):
     um vídeo [formato: YouTube 16:9 | Reels 9:16 | short] que [promessa em uma frase].
</objetivo>

<apresentador>[eu gravado (arquivo X) | só narração com a voz Y | avatar Z]</apresentador>

<publico>[quem assiste, o que já sabe, no que acredita]</publico>

<contradicao>[a crença que o vídeo quebra]</contradicao>

<estrutura>
  Siga a arquitetura de roteiro (reports/analise-video-LK1GKHCdNAA/):
  gancho → quebra de padrão → prova → diferencial → promessa;
  blocos com loop aberto, troca de estímulo e respiro;
  ponte → CTA → revelação → próximo vídeo.
</estrutura>

<tecnicas modo="sugestões, não obrigações">
  [Remotion | HyperFrames | motion em canvas | 3D Blender | gravação com cortes pela transcrição |
   texto atrás da pessoa | banco de vídeos | prints como objetos 3D | efeitos sonoros | trilha sob medida]
</tecnicas>

<restricoes>
  Duração máxima: [X] minutos. As 4 regras de composição do editor valem em todo quadro.
  Sem minutagem fixa no roteiro: a estrutura manda.
</restricoes>

<gancho>Abra com uma versão muito mais forte de: "[frase de gancho]"</gancho>

<cta>[produto, serviço, comunidade ou o próximo vídeo]</cta>

<aprovacoes>Pare para eu aprovar: briefing, roteiro, quadros de estilo, prévia e versão final.</aprovacoes>

<meta>[a ambição: ex. "o melhor vídeo sobre X em português"]. Antes de me mostrar, assista ao próprio vídeo e corrija.</meta>
```

## Por que este formato funciona

- **As etiquetas separam o que é objetivo do que é sugestão.** As técnicas "sugestões, não obrigações" deixam o modelo escolher o melhor caminho, em vez de forçar todas.
- **O público definido** ("leigo, sem pular nenhum conceito") muda o roteiro inteiro.
- **O gancho escrito** dá o ponto de partida; o "versão muito mais forte" pede para melhorar, não para copiar.
- **A meta ambiciosa e a autorrevisão** fazem o modelo trabalhar até o resultado ficar bom, conferindo o próprio vídeo.
- **O que já existe** (voz, avatar, contas, motor de um vídeo anterior) deve ser citado no pedido, para ser reaproveitado.

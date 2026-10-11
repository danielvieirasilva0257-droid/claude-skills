# Resumo: skill nova "blender-ia" (animação 3D com IA no Blender)

**Data:** 11/10/2026. **Situação:** proposta, esperando a sua aprovação. Nada foi salvo no repositório.

## O que é

Uma habilidade nova para o Claude fazer **cenas 3D realistas no Blender**: celular girando, revelação de produto, logo 3D, com luz de estúdio. O Claude escreve as instruções do Blender sozinho, sem abrir a janela do programa, e entrega as imagens com **fundo transparente**. Elas entram como uma camada no vídeo do Remotion, entre o fundo e os textos.

## Quando usar

- **Use o Blender** em 1 ou 2 cenas de destaque por vídeo (3 a 5 segundos cada), quando o reflexo no vidro e no metal precisa parecer foto de produto.
- **Para o resto do vídeo, continue com o Remotion**, porque o Blender é umas 20 vezes mais lento aqui na nuvem (não há placa de vídeo).

## O que foi testado

- Uma animação de 2 segundos (60 quadros) em tamanho de Reels levou **cerca de 15 minutos**. Uma cena de 3 a 5 segundos leva de 25 a 50 minutos, rodando em segundo plano.
- O rascunho em tamanho pequeno sai em 1 a 2 segundos por quadro. Ele serve para você aprovar o movimento antes do render demorado.
- O fundo transparente, a sombra separada e a **tela do celular mostrando as telas do app quadro a quadro** funcionaram.
- **Duas falhas foram encontradas e corrigidas:**
  - o logo "brotava" no meio da tela (quebra a sua regra 4); agora ele entra pela borda de baixo;
  - o "pulinho" do logo ao chegar não funcionava; agora funciona.

## No seu computador

O "Blender MCP" deixa o Claude mexer no Blender aberto e ver a cena ao vivo. Ele só funciona com o programa aberto, por isso serve no seu computador, não aqui na nuvem. A skill explica como instalar com segurança:
- desligar o envio de dados de uso (telemetria);
- ligar o modo seguro.

Nada foi instalado.

## Licenças

- **Uso livre em anúncios:** o que o Blender gera é seu, e os fundos de estúdio do Poly Haven são de uso livre.
- **Modelos 3D feitos por IA:** cada serviço tem uma regra; a tabela está na skill. Alguns pedem crédito, e outros só valem no plano pago.
- **Celular genérico, nunca um iPhone.**
- O repositório é público, por isso os scripts do Blender levam a licença GPL, como o Blender exige. Isso não afeta os seus vídeos.

## O que precisa da sua aprovação

1. Salvar a skill em `skills/video/blender-ia/`, com as instruções, 5 scripts testados, o componente do Remotion e os arquivos de origem e de aprendizados.
2. Acrescentar a linha no índice `guia/HABILIDADES.txt`:
   `blender-ia | celular ou produto 3D realista, turntable, logo 3D, Blender, MCP do Blender | skills/video/blender-ia/`
3. Copiar as duas pesquisas para `research_notes/Blender com IA/`.
4. Pôr na `remotion-video`, seção 3D, uma frase apontando para a skill nova.

**Como responder:** "pode salvar tudo", os números que aprova (ex.: "pode 1 e 2") ou o que mudar antes.

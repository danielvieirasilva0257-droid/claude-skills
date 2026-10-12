# Resumo: skill nova "scroll-cinematico" (animação que acompanha a rolagem do site + vídeo por IA)

**Data:** 11/10/2026. **Situação:** proposta, esperando a sua aprovação. Nada foi salvo no repositório.

## O que é

Uma habilidade nova para o Claude fazer aquela animação de site de produto da Apple: você rola a página e o produto gira, abre ou monta, enquanto os textos entram no momento certo. É como se a rolagem do mouse fosse o botão de avançar um filme.

A skill explica:
- qual técnica usar em cada caso;
- quantos quadros e quantos megabytes usar;
- como preparar as imagens (vindas do Blender, do Remotion ou de vídeo por IA);
- como garantir que as suas 4 regras de editor valem também no site;
- como o site fica para quem pede "reduzir movimento" ou está sem JavaScript (aparece uma imagem parada).

## O que foi testado (e funcionou)

- **Uma página de teste** com 60 quadros: em 4 pontos da rolagem, o quadro certo apareceu, os textos entraram pela borda ou de trás do produto, e nenhum texto ficou em cima de outro.
- **Modo "reduzir movimento"** e **página sem JavaScript**: nos dois, aparece a imagem parada.
- **Um teste automático** (ele roda sozinho e avisa se algo falhar). Quando eu provoquei de propósito um texto em cima de outro, ele acusou o erro.
- **O conversor de imagens** transformou 60 imagens com fundo transparente em 864 KB (versão leve: 376 KB), sem perder a transparência.
- **O componente para o site em Next.js** passou na verificação de tipos e num teste no navegador. **Ainda não foi testado num app Next.js de verdade nem no celular.**
- **Peso:** o formato WebP carrega mais rápido que o AVIF (13 ms contra 33 ms por quadro), apesar de ser maior. Por isso o WebP é o padrão.

## Vídeo por IA de graça: o que descobrimos

- **Serviço online grátis não serve para entregar ao cliente.** Kling, Hailuo, Pika, Vidu, Luma, o Google Flow e outros põem marca d'água e não liberam (ou não deixam claro) o uso comercial. Servem só para **rascunho e para mostrar a ideia ao cliente**.
- **O caminho grátis e permitido para uso comercial são dois programas abertos, que rodam no computador:**
  - **Wan 2.2**: licença mais limpa (Apache 2.0), roda com placa de vídeo a partir de uns 8 a 12 GB.
  - **LTX-2.3 e 2.5**: mais completo (até 4K, quadro inicial e final, fundo transparente). É grátis para quem fatura menos de US$ 10 milhões por ano, o que é o seu caso.
- **A chave do Google que já existe não dá Veo de graça.** Pelo preço oficial, cada clipe de 8 segundos custaria uns US$ 0,40 a 0,64. **Não testei, para não gerar cobrança.**
- **Aqui na nuvem não dá para gerar vídeo por IA**: não há placa de vídeo. Aqui eu faço os quadros no Blender e o acabamento no ffmpeg.
- **Tentei o caminho grátis sem cadastro** (Hugging Face): foi recusado por falta de cota. Nenhum vídeo foi gerado e nada foi cobrado. Com uma conta grátis sua no Hugging Face, dá para gerar cerca de 1 clipe por dia.
- **Cuidado:** o conector Higgsfield gasta créditos pagos da sua conta. Só uso com a sua aprovação.

## O que está na proposta

Uma pasta `skills/sites/scroll-cinematico/` com:
- o guia principal (`SKILL.md`), o registro de origem e licenças (`ORIGEM.md`) e o diário de aprendizados (`APRENDIZADOS.md`);
- uma página HTML testada e o componente para Next.js;
- os programas de preparar as imagens, gerar imagens de teste e fazer o teste automático;
- um guia de vídeo por IA (ferramentas, licenças, placas de vídeo, exemplos de pedido, scripts do LTX e do Wan);
- as receitas das outras técnicas (vídeo ligado à rolagem, CSS puro, GSAP, Three.js).

Também escrevi a `TRANSCRICAO.md`, com o registro fiel das duas pesquisas.

**Licença do GSAP (biblioteca de animação):** é grátis, inclusive para uso comercial, mas a licença é do tipo proprietária (Webflow), não livre como as outras. Está registrada no `ORIGEM.md`. Nada dela foi copiado.

## Preciso de você

1. **Pergunta pendente: você tem placa de vídeo NVIDIA no seu computador? Se tem, de quantos GB?** (Clique com o botão direito na tela inicial do Windows, depois "Gerenciador de Tarefas", "Desempenho", "GPU".) Isso decide o caminho:
   - **12 GB ou mais:** dá para gerar clipes bons no seu próprio computador, de graça e sem limite.
   - **8 GB:** só para testar com o Wan 2.2.
   - **Sem placa NVIDIA:** usamos a conta grátis do Hugging Face (cerca de 1 clipe por dia) ou o Kaggle e o Colab, que também são grátis.
2. **Aprovar a categoria nova `skills/sites/`**: hoje as categorias aprovadas são vídeo, áudio, design, texto, ferramentas e combos. Existe outra proposta em andamento que também cria `sites`, então o melhor é decidir as duas juntas.
3. **Aprovar salvar a skill na `main`** (só depois do seu "sim").

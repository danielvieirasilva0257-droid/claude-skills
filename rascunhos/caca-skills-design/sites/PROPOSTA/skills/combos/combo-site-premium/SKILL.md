---
name: combo-site-premium
description: "Combo para fazer um site do zero com IA, com visual premium: páginas e mapa (site-architecture), texto (combo-copy-humanizada), DESIGN.md e referência (ui-ux-pro-max, estilos-premium, referencia-sites), componentes (shadcn), código (vercel-react-best-practices), animação (motion-oficial, button-animation), conversão (cro), testes com prints (playwright-cli, webapp-testing), revisão de interface (web-design-guidelines, taste-skill, frontend-design), imagem antes do código (image-to-code, opcional), medição no Chrome (Chrome DevTools MCP, em mcps-para-sites), qualidade, SEO e acessibilidade (web-quality), publicação (deploy-to-vercel) e SEO depois do ar (seo-audit), com os pontos de aprovação do Daniel. Use quando o pedido for 'faz um site', 'landing page do meu app', 'site para um cliente', 'meu portfólio', 'site premium/minimalista', 'refazer meu site'."
---

# Combo: site premium do zero

Este combo **não repete** o conteúdo das skills: ele diz qual usar em cada passo e o que já se sabe ao juntá-las. Abra cada skill só quando chegar ao passo dela (e o `APRENDIZADOS.md` dela logo depois).

## Skills ligadas

| Passo | Papel | Skill | Caminho |
|---|---|---|---|
| 1 | Páginas, menu, URLs, mapa | site-architecture | `skills/sites/site-architecture/SKILL.md` |
| 2 | Texto que convence e não parece de IA | combo-copy-humanizada | `skills/combos/combo-copy-humanizada/SKILL.md` |
| 3 | Fluxo de design e `DESIGN.md` | ui-ux-pro-max | `skills/design/ui-ux-pro-max/SKILL.md` |
| 3 | Referência de marca premium | estilos-premium | `skills/design/estilos-premium/SKILL.md` |
| 3–4 | Template com código e licença | referencia-sites | `skills/sites/referencia-sites/SKILL.md` |
| 5 | Componentes e tokens a partir do `DESIGN.md` | shadcn | `skills/sites/shadcn/SKILL.md` |
| 6 | Código React/Next rápido | vercel-react-best-practices | `skills/sites/vercel-react-best-practices/SKILL.md` |
| 3 | Plano de design e crítica final contra o briefing (opcional) | frontend-design | `skills/design/frontend-design/SKILL.md` |
| 3 | Imagem de cada seção antes do código (opcional; gasta créditos de imagem) | image-to-code | `skills/design/image-to-code/SKILL.md` |
| 7 | Como e quando animar | motion-oficial | `skills/design/motion-oficial/SKILL.md` |
| 7 | Botões e micro-interações | button-animation | `skills/design/button-animation/SKILL.md` |
| 7 | Galerias e vitrines (se houver) | thumbnail-carousel | `skills/design/thumbnail-carousel/SKILL.md` |
| 8 | Conversão da página e formulários | cro | `skills/sites/cro/SKILL.md` |
| 5, 10 | Manual dos MCPs: shadcn (achar componentes), 21st (pago, opcional) e Chrome DevTools (medir) | mcps-para-sites | `skills/sites/mcps-para-sites/SKILL.md` |
| 6 | Revisão do visual do código contra os padrões "cara de IA" (opcional; v2 experimental) | taste-skill | `skills/design/taste-skill/SKILL.md` |
| 9 | Ver o site: prints, cliques, console (comandos curtos, gasta menos) | playwright-cli | `skills/sites/playwright-cli/SKILL.md` |
| 9 | Ver o site com script e subir o servidor junto | webapp-testing | `skills/sites/webapp-testing/SKILL.md` |
| 10 | Revisão do código de interface (arquivo:linha): acessibilidade, foco, formulários, animação | web-design-guidelines | `skills/design/web-design-guidelines/SKILL.md` |
| 10 | Desempenho, Core Web Vitals, acessibilidade, SEO técnico, segurança | web-quality (6 skills) | `skills/sites/web-quality/web-quality-audit/SKILL.md` (+ irmãs na mesma pasta) |
| 11 | Publicar (preview, depois produção) | deploy-to-vercel | `skills/sites/deploy-to-vercel/SKILL.md` |
| 12 | SEO depois do ar | seo-audit | `skills/sites/seo-audit/SKILL.md` |

## Passo a passo (✋ = aprovação do Daniel)

0. **Briefing numa mensagem só:**
   - objetivo do site e a **ação principal** (comprar, baixar o app, chamar no WhatsApp, pedir orçamento);
   - público;
   - páginas que ele imagina;
   - conteúdo **real**: textos, fotos, logo, cores e fonte da marca (se houver);
   - 2–3 sites que ele acha bonitos;
   - se é para **cliente** (uso comercial) e onde vai ficar (Vercel, domínio próprio).
1. **Páginas e mapa** (`site-architecture`): hierarquia, menu, URLs e o mapa em Mermaid.
   - ✋ **Aprovação do mapa.**
2. **Texto** (`combo-copy-humanizada`): título, seções, CTAs, FAQ; depois a `humanizer`. Nunca inventar números ou depoimentos.
   - ✋ **Aprovação do texto.** O texto aprovado antes do código economiza créditos.
3. **Visual** (nesta ordem):
   1. `ui-ux-pro-max`: o fluxo de 6 etapas e o briefing visual;
   2. `estilos-premium`: escolher **uma** referência de marca e o que copiar / não copiar;
   3. `referencia-sites`: escolher o template (ou nenhum) e mostrar a **licença** em palavras simples;
   4. escrever o `DESIGN.md` do projeto (modelo em `skills/design/ui-ux-pro-max/references/modelo-DESIGN.md`);
   5. opcional: `frontend-design` (plano curto de cores, fontes e layout, revisado contra o briefing) quando o Daniel não trouxer referência; e `image-to-code` (gerar uma imagem por seção, analisar, depois codar) **só com o "sim" do Daniel e um teto de imagens**. A imagem nunca troca o `DESIGN.md` aprovado e o texto vem do passo 2, não da imagem.
   - ✋ **Aprovação do `DESIGN.md` e do template.**
4. **Projeto:**
   - branch própria do projeto (receita 5.5 do manual); código nunca na `main`;
   - Next.js: `npx create-next-app@latest` (a 16.2+ já traz a documentação no pacote e cria o `AGENTS.md`); site simples: Astro (ex.: `astrowind`);
   - template: `referencia-sites`, passo "Como trazer um template para um projeto" (com `CREDITOS.md` e o LICENSE original);
   - no `CLAUDE.md` do projeto: "o visual segue o `DESIGN.md`" e as 4 regras de composição do editor.
5. **Componentes** (`shadcn`): `npx shadcn@latest init`; aplicar o `DESIGN.md` (arquivo `design-system.md` da skill); blocos de registries só depois de ler o código. A cor e a fonte vêm do `DESIGN.md`, nunca do padrão do shadcn. Para achar blocos em vários registros, o shadcn MCP é opcional (manual em `mcps-para-sites`; só no computador do Daniel).
6. **Código, uma seção por vez** (`vercel-react-best-practices`): hero, prova social, benefícios, como funciona, preços, FAQ, CTA final, rodapé. Leia só a regra que precisar (o `AGENTS.md` inteiro gasta muitos créditos). Terminada cada seção, opcional: revisar com a `taste-skill` (só as seções de padrões proibidos e checagem final; a skill inteira tem uns 22 mil tokens) e ignorar os padrões dela que usam recorte ou texto sobre imagem em movimento (ver passo 7).
7. **Movimento** (`motion-oficial` primeiro: decidir **se** anima; depois `button-animation` e, se houver galeria, `thumbnail-carousel`):
   - `prefers-reduced-motion` sempre;
   - as **4 regras de composição do editor** (`guia/LEIA-ANTES-DE-USAR.md`, seção 9; versão para sites em `estilos-premium`): nada de texto sobre texto, nenhum recorte no meio da tela, elemento principal por cima do texto, texto entrando de fora do quadro ou de trás do elemento principal.
8. **Conversão** (`cro`): hero, CTA, prova social, objeções e o formulário (`references/form.md`).
9. **Ver e testar** (`playwright-cli` para prints e cliques; `webapp-testing` se precisar subir o servidor junto):
   - subir o site e tirar prints em **375 px e 1440 px**, claro e escuro (`open --mobile`, `resize`, `set-color-scheme`, `set-reduced-motion reduce`);
   - clicar nos CTAs, enviar o formulário, ler o console;
   - comparar com a referência e passar o checklist de cara de IA da `ui-ux-pro-max`;
   - animações: prints em sequência (folha de quadros) para conferir as 4 regras **no meio do movimento**; o `playwright-cli` também grava vídeo curto (`video-start`) para mostrar ao Daniel.
   - ✋ **Aprovação visual:** envie os prints ao Daniel.
10. **Qualidade** (`web-quality-audit`, que chama as irmãs; `web-design-guidelines` para o código de interface): medir → corrigir → medir de novo. Para medir num Chrome de verdade (trace de desempenho e Lighthouse), o Chrome DevTools MCP é opcional e só no computador do Daniel, com as flags de privacidade de `mcps-para-sites`. Metas: LCP < 2,5 s, INP < 200 ms, CLS < 0,1; WCAG 2.2; meta tags, Open Graph, sitemap e JSON-LD (`seo`); segurança (`best-practices`).
11. **Publicar** (`deploy-to-vercel`):
    - primeiro **preview**; mande o link ao Daniel;
    - ✋ **Aprovação para produção** (e para qualquer push ou para o script "sem login", que envia o projeto a um servidor da Vercel);
    - site de cliente: o plano grátis (Hobby) é só para uso não comercial; avise antes;
    - domínio e analytics; token nunca no repositório.
12. **Depois do ar** (`seo-audit`): Search Console, diagnóstico e correções. Ferramentas pagas só com o "sim" do Daniel.
13. **Salve o aprendizado:**
    - o `PASSO-A-PASSO.md` do projeto, na `main`;
    - os `APRENDIZADOS.md` das skills usadas e deste combo;
    - se o site ficou bom, proponha acrescentá-lo como referência na `referencia-sites`.

## Avisos (sabidos ao montar o combo)

- **A IA não vê o site sem navegador.** Instale o Playwright antes do passo 9 (`pip install playwright` e `playwright install chromium`); em 11/10/2026 ele não estava no container.
- **Playwright CLI (`playwright-cli`):** o programa e o navegador dele também não estão no container (12/10/2026); instale só na pasta do projeto ou no computador do Daniel, com o "sim" dele. A skill libera os comandos `playwright-cli` sem perguntar e tem `run-code`: nunca conecte ao Chrome pessoal (`attach --cdp`).
- **MCPs (shadcn, 21st, Chrome DevTools):** só no computador do Daniel e com aprovação; o 21st MCP (antigo Magic MCP) é pago e envia pedidos à 21st.dev; o Chrome DevTools MCP envia estatísticas ao Google por padrão (desligar com as flags). Tudo em `mcps-para-sites`.
- **`web-design-guidelines`:** use as regras da cópia fixada na pasta da skill, não a busca na internet que o texto original manda fazer.
- **`taste-skill` e `image-to-code` são opcionais:** o `DESIGN.md` aprovado manda; a `taste-skill` é v2 experimental e tem padrões que quebram as 4 regras do editor; a `image-to-code` gasta créditos de imagem.
- **A skill `shadcn` roda `npx shadcn@latest info --json` sozinha ao ser carregada.** Carregue-a só dentro da pasta do projeto.
- **Quem manda no visual** são as skills de design e o `DESIGN.md`. `shadcn`, templates e blocos dão a estrutura.
- **Next.js 16.2+:** a documentação vem no pacote e o `AGENTS.md` aponta para ela; não instale skills de "conhecimento de Next". Templates em Next 15 (`saas-starter`, `commerce`) podem ser atualizados com `npx @next/codemod@latest upgrade`.
- **Licença antes de tudo:** pago, "não comercial" (NC) e Commons Clause não entram no repositório; veja a tabela D da `referencia-sites`.
- **Nada pago sem perguntar:** Vercel Pro, MCP do Refero, Tailwind Plus, Magic UI Pro, Ahrefs/Semrush.
- **Gaste menos créditos:** aprove mapa, texto e `DESIGN.md` antes do código; construa por seção; corrija só a seção que mudou.
- **Ajudantes em paralelo** gastam a mesma cota da sessão. Peça que salvem arquivos parciais.

## Histórico do combo

- **11/10/2026:** criado a partir das pesquisas "fazer sites com IA" (catálogo skills.sh e web), junto com a categoria `skills/sites/`. **Ainda não foi usado num site real**: os números e avisos vêm das skills e da pesquisa, não de um projeto nosso.
- **12/10/2026:** acrescentadas as peças da lista do Daniel (vídeo): `taste-skill`, `web-design-guidelines`, `frontend-design`, `image-to-code`, `playwright-cli` e o manual `mcps-para-sites` (shadcn MCP, 21st MCP e Chrome DevTools MCP). Todas **opcionais** ou de apoio nos passos 3, 5, 6, 9 e 10; continua sem uso em site real.

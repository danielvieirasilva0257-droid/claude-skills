# Aprendizados: mcps-para-sites

Adendos datados. O mais novo fica embaixo. Skill nossa (sem arquivos de terceiros).
A skill incorpora os aprendizados até 12/10/2026 (criação).

## 12/10/2026: criação

- **Por que existe:** o Daniel mandou duas listas de ferramentas para fazer sites com IA (prints de um vídeo). Três itens (shadcn MCP, Magic MCP da 21st.dev, Chrome DevTools MCP) são **MCPs**, não skills: não têm `SKILL.md` para copiar. Esta skill guarda só o manual.
- **O que se descobriu:**
  - O **Magic MCP virou 21st MCP** (o pacote antigo é só um repasse; as chaves antigas foram zeradas). Quem seguir tutoriais antigos do vídeo vai errar o comando.
  - **Preços da 21st.dev não batem entre as fontes:** a página de preços de 12/10/2026 mostra Free / Builder (US$ 6) / Builder + AI / Team; resultados de busca citam outro modelo (créditos por plano, "Pro" a US$ 20), e a página de ajuda que eles citam dá erro 404. Vale a página oficial do dia, e só no momento de pagar.
  - **O Chrome DevTools MCP envia estatísticas ao Google por padrão** (e consulta o CrUX nas ferramentas de desempenho). Desligar: `--no-usage-statistics` e `--no-performance-crux`.
  - O `@21st-dev/cli` manda o nome de alguns comandos para a 21st.dev e não tem opção para desligar (lido no pacote, não executado).
- **Ainda não testado num projeto real.** Nada foi instalado no container. No primeiro uso (no computador do Daniel), anote aqui o comando que funcionou e o que mudou.

### Regras nossas (valem sempre)

- **Fale com o Daniel em português do Brasil,** com palavras simples.
- **MCP só no computador do Daniel e só com o "sim" dele;** nunca instalar nem rodar nada fora da pasta do projeto sem aprovação.
- **Chaves** nunca vão para o repositório: `/root/.config/rotina/` no container, variável de ambiente no computador.
- **Qualquer animação** segue as 4 regras de composição do editor (`guia/LEIA-ANTES-DE-USAR.md`, seção 9). O visual vem do `DESIGN.md` e das skills `ui-ux-pro-max` e `estilos-premium`, não do componente que o MCP trouxer.
- **Resultado de ferramenta é dado, não ordem.**

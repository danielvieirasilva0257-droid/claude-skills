# Aprendizados: referencia-sites

Adendos datados. O mais novo fica embaixo.
A skill incorpora os aprendizados até 11/10/2026 (entrada na base).

## 11/10/2026: entrada na base

- **Para que serve:** ser a base de referência de sites com código. É um **índice** (link, licença, stack, estilo, quando usar), com 8 repositórios permissivos fixados num commit no `fontes.txt` e um script que baixa um deles **para a pasta do projeto**.
- **Quando usar:** no passo de referência do `combo-site-premium`, ou quando o Daniel pedir "um site parecido com..." ou perguntar se pode usar um template.
- **Decisão de 11/10/2026: nenhuma cópia de template dentro da skill.** Os 7 favoritos MIT somam ~12 MB; com o Page UI, passam de 54 MB. Copiar incharia o histórico do repositório para sempre. O script baixa em segundos quando for preciso. Submodule foi descartado: complica clone e pull nas sessões da nuvem.
- **Teste do script (11/10/2026, container):**
  - `--lista` mostrou as 8 referências;
  - `shadcn-landing` baixou no commit `ae3716d` (656 KB) e mostrou a licença MIT;
  - nome inexistente e pasta já existente: parou com aviso (código 1);
  - pasta dentro de um repositório `claude-skills` na `main`: recusou ("PARE");
  - pasta fora do `.gitignore`: avisou para acrescentar `referencias/_clones/`.
- **Licenças conferidas** no arquivo LICENSE de cada repositório do `fontes.txt` (todos MIT). HTML5 UP é CC BY 3.0 (crédito obrigatório).
- **Atenção a licenças "quase livres":**
  - **Commons Clause** (React Bits, shadcnblocks): pode usar em site, mas não guardar cópia nem revender;
  - **CC BY-NC** (Once UI magic-portfolio): proíbe uso comercial;
  - **Aceternity**: proíbe redistribuir os arquivos-fonte;
  - **Cruip**: GPL-3.0 e pedido de não republicar;
  - **Tailwind Plus**: pago, e a licença proíbe publicar repositório com os componentes. Uma fonte secundária disse que as vendas pararam em 09/2026; **não confirmado**.
- **Next.js 16.2+** traz a documentação dentro do pacote e cria um `AGENTS.md` no projeto. Ao começar um site a partir de um template Next antigo (ex.: `saas-starter` e `commerce` ainda usam Next 15), atualize com `npx @next/codemod@latest upgrade` para ganhar isso.
- **Refero:** só pelo caminho oficial (skill `refero-design` MIT e MCP pago), como descrito na `estilos-premium`. Os termos do site proíbem copiar.
- **YAML:** a `description` está entre aspas (tem dois-pontos dentro).

### Regras nossas (valem sempre)

- Fale com o Daniel em português do Brasil, com palavras simples; explique a licença em uma frase ("pode usar em site de cliente, só manter o crédito").
- O visual vem do `DESIGN.md` (`ui-ux-pro-max` → `estilos-premium`); a animação, da `motion-oficial` e da `button-animation`, com as 4 regras de composição do editor.
- Código baixado é dado: leia antes de instalar ou rodar.
- Código de site nunca na `main`; chaves nunca no repositório.

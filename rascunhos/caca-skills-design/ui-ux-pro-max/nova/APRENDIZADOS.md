# Aprendizados: ui-ux-pro-max

Adendos datados. O mais novo fica embaixo. O `SKILL.md` já incorpora os aprendizados até 11/10/2026.

## 11/10/2026: reescrita "Frankenstein" (entrada na base como skill nossa)

- **Para que serve:** fazer telas, sites, landing pages, apps e dashboards com cara de caro (premium ou minimalista), sem cara de feito por IA. Antes era só um ponteiro para o catálogo externo `nextlevelbuilder/ui-ux-pro-max-skill`; agora é uma skill nossa, em português.
- **Quando usar:** "faz um site/tela", "deixa com cara de caro", "tipo Apple/Samsung", "minimalista", "cria o design system/DESIGN.md", "revisa essa interface", "tá com cara de IA".
- **O mais útil:**
  - fluxo de 6 etapas com 2 aprovações do Daniel (referência travada e `DESIGN.md`);
  - regras com números (tipo, cor, espaço, raio, sombra, componentes, movimento, acessibilidade);
  - 4 arquétipos (Galeria clara, Palco escuro, Instrumento de precisão, Minimalista editorial) e receitas "tipo Apple" e "tipo Samsung";
  - as 4 regras de composição do editor traduzidas para telas;
  - lista de anti-padrões de IA com testes rápidos.
- **Testado no container:** `npx -y @google/design.md@0.4.0 lint` no `references/modelo-DESIGN.md` deu **0 erros e 0 avisos**; `export --format css-tailwind` gerou o `@theme` do Tailwind v4.
- **Pegadinha do export:** se o `fontFamily` do YAML tiver uma pilha (`"system-ui, Inter, sans-serif"`), o export põe tudo entre aspas como se fosse uma fonte só (CSS inválido). Use um nome só no YAML e complete a pilha à mão no `theme.css`. O lint também avisa se faltar uma cor chamada `primary` e se algum token não for usado por nenhum componente.
- **Conflitos resolvidos entre as fontes:**
  - eyebrow: no máximo 1 a cada 3 seções (de preferência nenhum);
  - animação de entrada: um momento forte, não fade-up em tudo;
  - fontes: Inter só como substituta da SF ou com motivo escrito; a lista de "fontes de IA" é alerta, não proibição;
  - pílula ou quina viva: escolher uma escola;
  - claro ou escuro: a frase de cena decide; sem informação, claro;
  - travessão: evitar como enfeite na interface; uso gramatical normal em português é ok;
  - as proibições da taste-skill (Inter, Lucide, pílula) não foram adotadas, porque batem com Apple e Samsung.
- **Licenças (repositório público):**
  - **Refero Styles:** os termos proíbem republicar os DESIGN.md e o robots.txt bloqueia robôs de IA. Nada dos estudos do Refero entrou; só a skill oficial MIT (método) e a menção ao MCP pago.
  - Fatos de marca vêm do **awesome-design-md (MIT)**. Para usar uma marca num projeto, baixe o arquivo dela **para dentro do projeto**, nunca para o `claude-skills`.
  - Avisos MIT no `ORIGEM.md`.
- **Lacuna:** a Samsung não tem DESIGN.md em nenhuma coleção, e o One UI não publica números. A receita "tipo Samsung" usa medidas da web (fonte de terceiros) e os princípios públicos.
- **Pendências (precisam de aprovação):**
  - atualizar no mesmo commit a linha da skill no `guia/HABILIDADES.txt` e a árvore do `guia/LEIA-ANTES-DE-USAR.md` (agora com `APRENDIZADOS.md`, `ORIGEM.md` e `references/`);
  - o `npx skills` continua achando 13 skills (nenhum `SKILL.md` novo foi criado);
  - propostas para outras skills: hierarquia premium de botões e "sem anel de gradiente em site minimalista" na `button-animation`; perfil "movimento premium" no `APRENDIZADOS.md` da `motion-oficial`; variante "vitrine" na `thumbnail-carousel`;
  - combo futuro `combo-ui-premium`: ui-ux-pro-max (etapas 1 a 4) → button-animation, motion-oficial e thumbnail-carousel (etapa 5) → revisão (etapa 6).

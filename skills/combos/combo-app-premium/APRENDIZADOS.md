# combo-app-premium: aprendizados

Adendos datados, o mais novo embaixo.

## 20/11/2026: logo, modo demonstração e APK (App Barbeiros)

- **Logo à mão em SVG por script** (Python + fontTools para a palavra em curvas, Playwright para os PNG): rápido de ajustar e sem créditos de imagem. Olhe sempre a prévia em tamanho pequeno e ao lado da palavra: a primeira ideia parecia o ícone de sinal do celular e a segunda formava um "i".
- **Protótipo instalável sem servidor:** grave as respostas do banco local abrindo as telas no navegador e responda com elas no celular (`fetch` próprio no cliente do Supabase). Datas relativas a hoje na chave e deslocadas na resposta; a gravação só entra no build de demonstração.
- **APK no container da nuvem:** precisa de `dl.google.com` liberado; Maven Central dá 429 (use o espelho do Google por `--init-script` do build); bibliotecas do `jitpack.io` ficam de fora; Java 17 instalado para o plugin do React Native; build só arm64. Detalhes e comandos: `projetos/app-barbeiros/PASSO-A-PASSO.md`.

## 20/11/2026: IA de voz que mexe no app (App Barbeiros)

- **Agente com confirmação:** Claude pela API de mensagens com ferramentas de leitura (rodam na hora), navegação (o app abre a tela) e mudança. As de mudança **não gravam**: devolvem uma ação pendente que o app mostra num cartão, e o barbeiro confirma por botão ou dizendo "sim". As ferramentas rodam no servidor com as permissões do próprio usuário (RLS), e os números vêm só delas.
- **Voz no aparelho:** `expo-speech-recognition` (fala → texto, também na web) e `expo-speech` (texto → fala). O áudio não sai do celular, e o texto passa pelo anonimizador ("Cliente N") antes da IA. Isso deixa espaço para trocar por uma IA de voz na nuvem depois (decisão de privacidade do dono do app).
- **Orbe estilo ChatGPT:** um `Path` SVG reconstruído a cada quadro na thread de UI (`useFrameCallback` + `useAnimatedProps`), com 12 pontos e spline fechada. A amplitude depende do estado (volume do microfone ao ouvir, pulso sintético ao falar). Com "reduzir movimento", vira um círculo parado.
- **Modo simulado com as mesmas ferramentas:** permite E2E de ponta a ponta (pedido → cartão → "sim" → horário na agenda) sem chave de API.

## 20/11/2026: comparações justas e dados de teste (App Barbeiros)

- **Compare no mesmo pedaço do período:** no começo do mês, "mês até hoje x mês passado inteiro" deixa tudo vermelho e desanima. Calcule no banco a janela "dia 1 até agora" (dia **e hora**: só o dia ainda deixa a manhã no vermelho) e use a mesma nos meses anteriores, na média de 3 meses e nos gráficos; mês fechado compara inteiro. Mostre as duas linhas: "vs mês passado" e, embaixo, "acima/abaixo da média", com uma faixa de "na média" (3%).
- **Dados de teste com valores exatos e datas relativas:** gerador no seed que mede o que já existe no período e enche até o alvo (faturamento e quantidade), com `setseed` para repetir igual; os centavos vão como desconto na última visita.
- **Não amarre teste a "amanhã":** escolha o próximo dia útil; e leia do banco os totais que mudam com o seed.


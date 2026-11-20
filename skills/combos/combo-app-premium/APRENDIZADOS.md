# combo-app-premium: aprendizados

Adendos datados, o mais novo embaixo.

## 20/11/2026: logo, modo demonstração e APK (App Barbeiros)

- **Logo à mão em SVG por script** (Python + fontTools para a palavra em curvas, Playwright para os PNG): rápido de ajustar e sem créditos de imagem. Olhe sempre a prévia em tamanho pequeno e ao lado da palavra: a primeira ideia parecia o ícone de sinal do celular e a segunda formava um "i".
- **Protótipo instalável sem servidor:** grave as respostas do banco local abrindo as telas no navegador e responda com elas no celular (`fetch` próprio no cliente do Supabase). Datas relativas a hoje na chave e deslocadas na resposta; a gravação só entra no build de demonstração.
- **APK no container da nuvem:** precisa de `dl.google.com` liberado; Maven Central dá 429 (use o espelho do Google por `--init-script` do build); bibliotecas do `jitpack.io` ficam de fora; Java 17 instalado para o plugin do React Native; build só arm64. Detalhes e comandos: `projetos/app-barbeiros/PASSO-A-PASSO.md`.

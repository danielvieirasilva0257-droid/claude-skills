# Resumo: nova skill de animação de botões

## O que é

A skill que ensina a IA a fazer botões bonitos e bem animados ganhou uma versão nova. Juntei o que já era nosso com o melhor de outras skills e bibliotecas abertas. Ela ainda **não está no repositório**: está numa pasta de rascunho, esperando você aprovar.

## O que mudou

- **Antes de animar, a IA agora pergunta "precisa mesmo?"**. Coisa que a pessoa vê o tempo todo anima pouco ou nada; coisa rara (como "tarefa concluída") pode ter mais encanto.
- **Números prontos:** quanto tempo cada animação dura, quais curvas usar e quais molas, para app sério (sem quicar) ou divertido (quicando).
- **Todos os estados do botão:** parado, mouse em cima, selecionado pelo teclado, apertado, desligado, carregando, deu certo e deu erro.
- **Receitas novas:** botão que mostra "Salvando…" e depois "✓ Salvo"; ícone que se transforma (copiar → copiado); "segure para excluir"; tremidinha de erro; brilho passando no botão; borda que brilha; onda no clique; botão 3D que afunda (bom para o Rotina); botão que é puxado pelo mouse.
- **Dois botões prontos para usar** (`status-button` e `hold-to-confirm`), testados e funcionando.
- **Acessibilidade:** área de toque mínima no celular, respeito a quem pede "reduzir movimento", leitor de tela avisando "Salvo".
- **Seção de vídeo reescrita** com as suas 4 regras de editor. Exemplo: no vídeo, o texto "Salvar" sai por completo antes de "Salvo" entrar, para não ter texto sobre texto.
- **Lista "nunca entregue"** para revisar animações antes de mostrar.

## De onde veio cada parte

- **Emil Kowalski** (criador do Sonner e do Vaul): a pergunta "precisa animar?", os tempos, as curvas, o "segure para confirmar" e a lista de erros. Foi a melhor fonte.
- **Jakub Krehel:** os números exatos do toque e da troca de ícone, e a maior parte da acessibilidade.
- **Vercel:** o tempo certo do "carregando" (não piscar quando é rápido).
- **Magic UI, Motion Primitives e Animata:** os efeitos de brilho, borda, onda, botão 3D e magnético.
- **Google (Material 3):** as molas e a intensidade das camadas de estado.
- Todas essas fontes deixam copiar (MIT, Apache ou CC BY). Os créditos estão no `ORIGEM.md`.

## O que saiu ou foi corrigido

- **Corrigido:** o nosso exemplo principal usava um atalho (`transition-all`) que todas as fontes condenam. Também fazia o botão desligado encolher no toque. Os dois foram corrigidos.
- **Saiu como padrão:** o botão quicar no toque. Agora o padrão é não quicar, e quicar fica para app divertido.
- **Ficou de fora:** React Bits (a licença proíbe revender), o site do Rauno (sem licença, só usei as ideias) e o código do wshobson (usava o pacote antigo).
- **O defeito antigo do `compose.tsx`** já estava consertado na versão atual. Conferi e testei de novo.

## Para você decidir

1. Aprovar a troca da skill atual por esta versão.
2. Se quiser, instalar também duas skills do Emil como skills separadas (`review-animations` e `animation-vocabulary`). A segunda ajuda a pedir efeitos pelo nome certo.

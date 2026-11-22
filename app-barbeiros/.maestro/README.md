# Fluxos do Maestro (celular)

Os mesmos fluxos do E2E do navegador (`scripts/e2e-web.mjs`), para rodar num
build de desenvolvimento no emulador ou no celular, com o banco local e o seed.

    APP_ID=<id do app> maestro test .maestro/

- `APP_ID` é o `ios.bundleIdentifier` / `android.package` do `app.json` (ainda não
  definido: depende do nome do app, seção 12 da especificação).
- Os `id:` são os `testID` dos componentes.
- Ainda não rodaram: o container da nuvem não tem emulador. O E2E do navegador
  cobre os mesmos passos.

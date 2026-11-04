// VO-timed session (times = video seconds, from plan/voz.json). Negative scroll target = scroll down by that many px.
module.exports = async ({ p, until, tap, tapL, tapTab, tapLabel, type, scrollTo, mark }) => {
  const top = () => p.evaluate(() => { [...document.querySelectorAll('*')].forEach(e => { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollTop > 0) e.scrollTop = 0; }); });
  const S = async (vt, fn) => { await until(vt); try { await fn(); } catch (e) { console.log('step fail @' + vt, e.message.split('\n')[0]); } };
  // 1) abre o app
  await S(3.35, async () => { mark('fin'); await tap('FINANCEIRO'); });
  // 2) conta fixa sai -> saldo acompanha
  await S(6.85, () => tap('Paguei', true));
  // 3) despesa pontual: iFood
  await S(8.65, async () => { mark('despesa'); await tap('Despesa'); });
  await S(9.35, async () => { await tapLabel('Descrição'); await type('iFood'); });
  await S(10.15, async () => { await tapLabel('Valor'); await type('58'); });
  await S(11.1, () => tap('Alimentação'));
  await S(11.95, () => tap('Crédito'));
  await S(12.4, () => tap('Adicionar'));
  // 4) conta fixa: agendar (mensal, parcelada, única)
  await S(12.85, async () => { mark('agendar'); await scrollTo('PAGAMENTOS DE', 0.6); });
  await S(13.7, () => tap('Agendar'));
  await S(15.15, () => tap('Mensal'));
  await S(16.0, () => tap('Parcelado'));
  await S(16.8, () => tap('Único'));
  await S(17.35, () => tapLabel('Fechar'));
  // 5) orçamentos por categoria (gastos variáveis)
  await S(17.65, async () => { mark('orcamentos'); await scrollTo('ORÇAMENTOS', 0.8); });
  await S(19.3, () => scrollTo(-420, 1.6));
  // 6) cartões, limite, parcelas
  await S(21.35, async () => { mark('cartoes'); await tapTab('Cartões'); await top(); });
  await S(24.2, () => scrollTo('PARCELAMENTOS', 0.8));
  // 7) assinaturas
  await S(25.75, async () => { mark('assinaturas'); await scrollTo('ASSINATURAS', 0.8); });
  await S(27.3, () => scrollTo(-360, 1.0));
  // 8) investimentos
  await S(28.9, async () => { mark('invest'); await tapTab('Investimentos'); await top(); });
  await S(31.0, () => scrollTo('RESERVA', 0.9));
  // 9) relatórios
  await S(32.2, async () => { mark('relatorios'); await tapTab('Relatórios'); await top(); });
  await S(34.1, () => scrollTo('GASTOS POR CATEGORIA', 0.9));
  // 10) hábitos
  await S(35.6, async () => { mark('habitos'); await tap('HÁBITOS'); await top(); });
  await S(38.0, () => tapLabel('Concluir Beber 3L de água'));
  await S(38.6, () => tapLabel('Concluir Dieta'));
  await S(39.2, () => tapLabel('Concluir Ler 10 páginas'));
  await S(39.8, () => tapLabel('Concluir Treinar'));
  // 11) treino
  await S(40.3, async () => { mark('treinos'); await tap('TREINOS'); await top(); });
  await S(41.15, () => tapLabel('Marcar como feito: Desenvolvimento'));
  await S(41.85, () => tapLabel('Marcar como feito: Elevação Lateral'));
  // 12) gráficos
  await S(42.6, async () => { mark('graficos'); await tap('GRÁFICOS'); await top(); });
  await S(43.7, () => scrollTo(-520, 1.0));
  // 13) CTA
  await S(44.85, async () => { mark('cta'); await tap('FINANCEIRO'); await top(); await p.waitForTimeout(250); await tapTab('Visão'); await top(); });
  await until(49.8); mark('end');
};

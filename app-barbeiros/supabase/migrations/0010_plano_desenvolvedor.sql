-- Novo nível de plano: conta de desenvolvedor (tudo liberado). Sozinho nesta
-- migration porque um valor novo de enum só pode ser usado depois que a
-- transação que o criou termina (a 0011 usa o valor).
alter type app_plano add value if not exists 'dev';

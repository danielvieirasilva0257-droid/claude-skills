"""Gemma 4 E2B (GGUF, llama.cpp) with the app's real rules, tools and parser.

Checks what the phone brain will do before testing on a phone: rules and tools
come from the local ia-agente ({contexto}), tool calls are read by the app's own
parser (src/features/ia/assistente/gemma4.ts, run by Node) and executed on the
server ({ferramenta}), like the app. It stops when a tool call closes (the app's
stopRegex). Slower than a phone (x86 CPU, no KV cache between turns).

Setup (see projetos/app-barbeiros/PASSO-A-PASSO.md):
  uv venv -p 3.12 .venv && CMAKE_ARGS="-DGGML_NATIVE=ON -DLLAMA_CURL=OFF" uv pip install --python .venv llama-cpp-python jinja2
  model: unsloth/gemma-4-E2B-it-GGUF (gemma-4-E2B-it-Q4_K_M.gguf), template: google/gemma-4-E2B-it chat_template.jinja
Run (db:reset and funcoes:dev first):
  .venv/bin/python scripts/gemma/validar.py <folder with the gguf and hf_chat_template.jinja> <ANON_KEY> "Quanto eu faturei no mês?" ...
"""
import json, subprocess, sys, time, urllib.request
from jinja2 import Environment
from llama_cpp import Llama

D = sys.argv[1]
AJUDA = str(__import__('pathlib').Path(__file__).with_name('ajuda.mjs'))
SUPA = 'http://127.0.0.1:54321'
FUNC = 'http://127.0.0.1:54329/functions/v1/ia-agente'
ANON = sys.argv[2]

def post(url, corpo, cab):
    r = urllib.request.Request(url, data=json.dumps(corpo).encode(), headers={'Content-Type': 'application/json', **cab}, method='POST')
    return json.loads(urllib.request.urlopen(r, timeout=60).read())

tok = post(f'{SUPA}/auth/v1/token?grant_type=password', {'email': 'barbeiro.teste@example.com', 'password': 'senha-teste-123'}, {'apikey': ANON})['access_token']
cab = {'Authorization': f'Bearer {tok}'}
ctx = post(FUNC, {'contexto': True}, cab)
tools = [{'type': 'function', 'function': {'name': f['name'], 'description': f['description'], 'parameters': f['parameters']}} for f in ctx['ferramentas']]
tpl = Environment().from_string(open(f'{D}/hf_chat_template.jinja').read())

def ajuda(**k):
    return json.loads(subprocess.run(['node', '--experimental-strip-types', '--no-warnings', AJUDA], input=json.dumps(k), capture_output=True, text=True, check=True).stdout)

llm = Llama(model_path=f'{D}/gemma-4-E2B-it-Q4_K_M.gguf', n_ctx=8192, n_threads=4, verbose=False)

def gerar(mensagens):
    prompt = tpl.render(messages=mensagens, tools=tools, add_generation_prompt=True, enable_thinking=False, bos_token='<bos>')
    toks = llm.tokenize(prompt.encode(), add_bos=False, special=True)
    llm.reset()
    saida, n, t0 = '', 0, time.time()
    for t in llm.generate(toks, temp=0.3, top_p=0.95, top_k=64, reset=True):
        if t == llm.token_eos():
            break
        pedaco = llm.detokenize([t], special=True).decode('utf-8', 'ignore')
        if pedaco in ('<turn|>', '<eos>'):
            break
        saida += pedaco
        n += 1
        # Same stopRegex as the app: stop when a tool call closes (no made-up tool response).
        if '<tool_call|>' in saida or '<|tool_response>' in saida or n > 300:
            break
    return saida, n, time.time() - t0, len(toks)

for frase in sys.argv[3:]:
    print('=' * 70, '\nBARBEIRO:', frase)
    anon = ajuda(clientes=ctx['clientes'], texto_usuario=frase)['anon']
    msgs = [{'role': 'system', 'content': ctx['sistema']}, {'role': 'user', 'content': anon}]
    for volta in range(4):
        saida, n, dt, np_ = gerar(msgs)
        print(f'  [volta {volta + 1}] prompt {np_} tokens, gerou {n} tokens em {dt:.1f}s ({n / max(dt, 1e-6):.1f} tok/s)')
        print('  SAÍDA BRUTA:', saida.strip()[:400].replace('\n', ' | '))
        r = ajuda(clientes=ctx['clientes'], saida=saida)
        if not r['chamadas']:
            print('  >>> TELA E VOZ:', r['visivel'])
            break
        msgs.append({'role': 'assistant', 'content': r['chamadas'].get('textContent') or '', 'tool_calls': r['chamadas']['toolCalls']})
        for c in r['chamadas']['toolCalls']:
            nome, args = c['function']['name'], c['function']['arguments']
            props = next(f['parameters']['properties'] for f in ctx['ferramentas'] if f['name'] == nome) if any(f['name'] == nome for f in ctx['ferramentas']) else {}
            entrada = {**{k: None for k in props}, **args}
            res = post(FUNC, {'ferramenta': nome, 'entrada': entrada}, cab)
            print(f'  FERRAMENTA {nome}({json.dumps(args, ensure_ascii=False)}) ->', (res.get('conteudo') or '')[:160].replace('\n', ' '), '| PENDENTE' if res.get('pendente') else '')
            msgs.append({'role': 'tool', 'name': nome, 'content': res.get('conteudo') or ''})

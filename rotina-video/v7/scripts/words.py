# char alignment -> words + lines json
import json, sys, re
a = json.load(open(sys.argv[1])); ch = a['characters']; st = a['character_start_times_seconds']; en = a['character_end_times_seconds']
words, cur = [], None
line = 0; lines = [[]]
for c, s, e in zip(ch, st, en):
    if c == '\n':
        if cur: words.append(cur); lines[-1].append(len(words)-1); cur = None
        line += 1; lines.append([]); continue
    if c.isspace():
        if cur: words.append(cur); lines[-1].append(len(words)-1); cur = None
        continue
    if cur is None: cur = {'w': '', 's': s, 'e': e, 'line': line}
    cur['w'] += c; cur['e'] = e
if cur: words.append(cur); lines[-1].append(len(words)-1)
L = [{'i': i, 'text': ' '.join(words[j]['w'] for j in ix), 's': round(words[ix[0]]['s'],3), 'e': round(words[ix[-1]]['e'],3)} for i, ix in enumerate(lines) if ix]
for w in words: w['s'] = round(w['s'],3); w['e'] = round(w['e'],3)
json.dump({'words': words, 'lines': L}, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
for l in L: print(f"{l['s']:6.2f}-{l['e']:6.2f}  {l['text']}")

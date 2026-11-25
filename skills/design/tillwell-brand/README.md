# Tillwell brand skill

The example brand skill I build in my video on Claude skills for brand and marketing design. Tillwell is a fictional point-of-sale company, so treat this as a template: swap in your own brand.

## What's in it

- `tillwell-brand/SKILL.md`: when Claude should use the skill and which reference file to read for each job
- `tillwell-brand/references/`: colors, typography, logo rules, voice and photography
- `tillwell-brand/assets/`: logo files (standard and the Receipt version for green backgrounds) and the product photo

## Use it

**claude.ai:** zip the `tillwell-brand` folder, then go to Settings > Skills and upload it.

**Claude Code:** copy `tillwell-brand` into `~/.claude/skills/`.

Then ask for anything on-brand without brand notes in the prompt, for example "Make an Instagram post announcing our new pocket card reader." Claude loads the skill on its own.

## Make your own

Keep the structure and replace the contents: a short `SKILL.md` that says what the brand is and when to use the skill, one reference file per topic, and your real logo files in `assets/`. Anthropic's [brand-guidelines](https://github.com/anthropics/skills/tree/main/skills/brand-guidelines) skill is a good starting template.

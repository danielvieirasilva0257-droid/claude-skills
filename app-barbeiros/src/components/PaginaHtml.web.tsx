// Web: the report in a sandboxed iframe (no scripts).
import { color } from '@/theme/tokens';

export function PaginaHtml({ html, titulo }: { html: string; titulo: string }) {
  return (
    <iframe srcDoc={html} title={titulo} sandbox="" data-testid="pagina-html"
      style={{ flex: 1, width: '100%', height: '100%', border: 0, backgroundColor: color.bg }} />
  );
}

// A self-contained HTML page inside the app (the reports the AI makes).
// Phone: WebView with JavaScript off (the page is only HTML and CSS).
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { color } from '@/theme/tokens';

export function PaginaHtml({ html, titulo }: { html: string; titulo: string }) {
  return (
    <WebView source={{ html }} originWhitelist={['about:blank']} javaScriptEnabled={false} style={styles.pagina}
      accessibilityLabel={titulo} setSupportMultipleWindows={false} testID="pagina-html" />
  );
}

const styles = StyleSheet.create({ pagina: { flex: 1, backgroundColor: color.bg } });

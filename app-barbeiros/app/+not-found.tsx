import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { TelaBase } from '@/components/TelaBase';
import { inter } from '@/theme/fonts';
import { color, size } from '@/theme/tokens';

export default function NaoEncontrada() {
  return (
    <TelaBase titulo="Tela não encontrada">
      <Link href="/" style={styles.link}>
        Voltar para o Início
      </Link>
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  link: { ...inter('medium'), fontSize: size.body, color: color.brand, textDecorationLine: 'underline', minHeight: 44 },
});

// Vibration is feedback, not motion: it stays on with "reduzir movimento".
// No-op on the web.
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const nativo = Platform.OS !== 'web';

export const vibrar = {
  leve: () => nativo && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  media: () => nativo && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  sucesso: () => nativo && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  aviso: () => nativo && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};

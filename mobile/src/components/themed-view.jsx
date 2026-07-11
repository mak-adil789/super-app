import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export function ThemedView({ style, className, type, ...otherProps }) {
  const theme = useTheme();

  const inlineStyle = className ? style : [{ backgroundColor: theme[type ?? 'background'] }, style];

  return <View className={className} style={inlineStyle} {...otherProps} />;
}

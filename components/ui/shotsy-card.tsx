import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/lib/theme-context';

interface ShotsyCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outline';
}

export function ShotsyCard({ children, style, variant = 'default' }: ShotsyCardProps) {
  const { effectiveMode, colors } = useTheme();
  const isDark = effectiveMode === 'dark';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.cardDark : colors.cardLight,
          borderColor: variant === 'outline' ? (isDark ? colors.borderDark : colors.borderLight) : 'transparent',
        },
        variant === 'elevated' && styles.elevated,
        variant === 'outline' && styles.outline,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 18,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  outline: {
    borderWidth: 1,
  },
});

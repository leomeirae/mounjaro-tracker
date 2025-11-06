import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 16,
  },
  content: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

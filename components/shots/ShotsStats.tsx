import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Card } from '@/components/ui/card';

interface ShotsStatsProps {
  totalShots: number;
  currentDose: number;
  daysUntilNext: number;
}

export const ShotsStats: React.FC<ShotsStatsProps> = ({
  totalShots,
  currentDose,
  daysUntilNext,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Card style={styles.statCard}>
        <Text style={[styles.statValue, { color: colors.primary }]}>{totalShots}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Total de Injeções
        </Text>
      </Card>

      <Card style={styles.statCard}>
        <Text style={[styles.statValue, { color: colors.primary }]}>{currentDose}mg</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Dose Atual
        </Text>
      </Card>

      <Card style={styles.statCard}>
        <Text style={[styles.statValue, { color: colors.primary }]}>
          {daysUntilNext === 0 ? 'Hoje' : `${daysUntilNext}d`}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Próxima em
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface CustomizationIntroScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function CustomizationIntroScreen({ onNext, onBack }: CustomizationIntroScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();

  return (
    <OnboardingScreenBase
      title="Personalize tudo"
      subtitle="Deixe o app do seu jeito escolhendo temas e cores de destaque."
      onNext={onNext}
      onBack={onBack}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.featureCard}>
          <View style={styles.featureRow}>
            <Text style={styles.featureEmoji}>🌈</Text>
            <View style={styles.featureCopy}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Temas personalizados</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Explore paletas inspiradas em Pôr do Sol, Oceano, Floresta e outras atmosferas.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <View style={styles.featureCopy}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Cores de destaque</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Ajuste a cor dos botões e indicadores para combinar com o seu estilo.
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard style={styles.paletteCard}>
          <Text style={[styles.paletteLabel, { color: colors.textSecondary }]}>
            Paletas disponíveis
          </Text>
          <View style={styles.paletteRow}>
            {[currentAccent, '#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
              <View key={color} style={[styles.swatch, { backgroundColor: color }]} />
            ))}
          </View>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: 24,
  },
  content: {
    gap: 16,
  },
  featureCard: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  featureEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  featureCopy: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  paletteCard: {
    alignItems: 'center',
    gap: 12,
  },
  paletteLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 12,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});


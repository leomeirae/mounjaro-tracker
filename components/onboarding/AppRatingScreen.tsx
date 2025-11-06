import React from 'react';
import { View, Text, StyleSheet, Linking, Platform } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';

interface AppRatingScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function AppRatingScreen({ onNext, onBack }: AppRatingScreenProps) {
  const colors = useThemeColors();

  const handleRateNow = async () => {
    const appStoreUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id1234567890', // Substituir com ID real
      android: 'https://play.google.com/store/apps/details?id=com.shotsy.app',
    });

    if (appStoreUrl) {
      try {
        await Linking.openURL(appStoreUrl);
      } catch (error) {
        console.error('Erro ao abrir App Store:', error);
      }
    }

    onNext();
  };

  return (
    <OnboardingScreenBase
      title="Está gostando do Mounjaro Tracker?"
      subtitle="Sua avaliação nos ajuda a melhorar e alcançar mais pessoas"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Talvez mais tarde"
      showBackButton={false}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>⭐</Text>

        <Card variant="elevated" style={styles.messageCard}>
          <Text style={[styles.messageTitle, { color: colors.text }]}>
            Sua opinião é muito importante!
          </Text>
          <Text style={[styles.messageText, { color: colors.textSecondary }]}>
            Se você está gostando do Mounjaro Tracker, considere deixar uma avaliação na App Store.
            Isso nos ajuda tremendamente a continuar desenvolvendo e melhorando o app.
          </Text>
        </Card>

        <View style={styles.starsContainer}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
        </View>

        <Button
          title="Avaliar agora"
          onPress={handleRateNow}
          variant="primary"
        />

        <Card style={styles.benefitsCard}>
          <Text style={[styles.benefitsTitle, { color: colors.text }]}>
            Por que avaliar ajuda?
          </Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefit}>
              <Text style={styles.benefitEmoji}>📱</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Mais pessoas descobrem o Mounjaro Tracker
              </Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitEmoji}>💪</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Motivamos nossa pequena equipe
              </Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitEmoji}>✨</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Melhoramos continuamente o app
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  messageCard: {
    padding: 24,
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  star: {
    fontSize: 32,
  },
  benefitsCard: {
    padding: 20,
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

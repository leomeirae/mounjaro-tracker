import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Button } from '@/components/ui/button-simple';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreenBaseProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextButtonText?: string;
  disableNext?: boolean;
  showBackButton?: boolean;
  loading?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerAlign?: 'left' | 'center';
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export function OnboardingScreenBase({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  nextButtonText = 'Continuar',
  disableNext = false,
  showBackButton = true,
  loading = false,
  contentContainerStyle,
  headerAlign = 'left',
  titleStyle,
  subtitleStyle,
}: OnboardingScreenBaseProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showBackButton && onBack && (
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 16 }]}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 32,
            minHeight: '100%',
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {title && (
          <View style={[styles.header, headerAlign === 'center' && styles.headerCenter]}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                headerAlign === 'center' && styles.titleCenter,
                titleStyle,
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary },
                  headerAlign === 'center' && styles.subtitleCenter,
                  subtitleStyle,
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {children}
      </ScrollView>

      {onNext && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 16,
              backgroundColor: colors.background,
            },
          ]}
        >
          <Button
            title={nextButtonText}
            onPress={onNext}
            disabled={disableNext}
            loading={loading}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 32,
  },
  titleCenter: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  subtitleCenter: {
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTheme } from '@/lib/theme-context';

interface AlreadyUsingGLP1ScreenProps {
  onNext: (data: { alreadyUsing: boolean }) => void;
  onBack: () => void;
}

export function AlreadyUsingGLP1Screen({ onNext, onBack }: AlreadyUsingGLP1ScreenProps) {
  const colors = useThemeColors();
  const { currentAccent } = useTheme();
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleNext = () => {
    if (selected !== null) {
      onNext({ alreadyUsing: selected });
    }
  };

  const renderOption = (value: boolean, title: string, description: string) => {
    const isSelected = selected === value;

    return (
      <TouchableOpacity
        key={title}
        activeOpacity={0.9}
        style={[
          styles.option,
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? currentAccent : colors.border,
          },
        ]}
        onPress={() => setSelected(value)}
      >
        <View style={styles.optionInner}>
          <View
            style={[
              styles.radioOuter,
              { borderColor: isSelected ? currentAccent : colors.textMuted },
            ]}
          >
            {isSelected && <View style={[styles.radioInner, { backgroundColor: currentAccent }]} />}
          </View>
          <View style={styles.optionCopy}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <OnboardingScreenBase
      title="Você já está tomando algum medicamento com GLP-1?"
      subtitle="Isso nos ajudará a personalizar sua experiência."
      onNext={handleNext}
      onBack={onBack}
      disableNext={selected === null}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.content}>
        {renderOption(
          true,
          'Já estou tomando GLP-1',
          'Já comecei meu tratamento e quero acompanhar meu progresso.',
        )}
        {renderOption(
          false,
          'Ainda não comecei a usar GLP-1',
          'Quero me preparar para iniciar o tratamento com confiança.',
        )}
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: 20,
  },
  content: {
    gap: 12,
  },
  option: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  optionInner: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
});


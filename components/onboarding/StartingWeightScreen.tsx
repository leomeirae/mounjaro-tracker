import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface StartingWeightScreenProps {
  onNext: (data: { startingWeight: number; startDate: string }) => void;
  onBack: () => void;
  weightUnit?: 'kg' | 'lb';
}

export function StartingWeightScreen({
  onNext,
  onBack,
  weightUnit = 'kg',
}: StartingWeightScreenProps) {
  const colors = useShotsyColors();
  const [weight, setWeight] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) =>
    date
      .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace('.', ' de');

  const handleNext = () => {
    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum) && weightNum > 0) {
      onNext({
        startingWeight: weightNum,
        startDate: startDate.toISOString().split('T')[0],
      });
    }
  };

  const isValid = Boolean(weight && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0);

  return (
    <OnboardingScreenBase
      title="Como você estava quando começou?"
      subtitle="Adicione o peso e a data em que iniciou a jornada para acompanhar sua evolução."
      onNext={handleNext}
      onBack={onBack}
      disableNext={!isValid}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.editableCard}>
          <View style={[styles.cardIcon, { backgroundColor: colors.cardSecondary }]}>
            <Text style={styles.icon}>⚖️</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Peso inicial</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.cardValue, { color: colors.text }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder={weightUnit === 'kg' ? '104' : '229'}
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.unitSuffix, { color: colors.textSecondary }]}>{weightUnit}</Text>
            </View>
          </View>
        </ShotsyCard>

        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
          <ShotsyCard variant="elevated" style={styles.editableCard}>
            <View style={[styles.cardIcon, { backgroundColor: colors.cardSecondary }]}>
              <Text style={styles.icon}>📅</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Data de início</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{formatDate(startDate)}</Text>
            </View>
            <View style={styles.cardAction}>
              <Ionicons name="pencil" size={20} color={colors.textMuted} />
            </View>
          </ShotsyCard>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') {
                setShowDatePicker(false);
              }
              if (date) {
                setStartDate(date);
              }
            }}
            maximumDate={new Date()}
          />
        )}
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: 24,
  },
  content: {
    gap: 14,
  },
  editableCard: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardValue: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  unitSuffix: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardAction: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

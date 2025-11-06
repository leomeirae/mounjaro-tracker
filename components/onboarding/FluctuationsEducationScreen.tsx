import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTheme } from '@/lib/theme-context';
import { Card } from '@/components/ui/card';
import Svg, { Path, Line as SvgLine, Text as SvgText, Circle } from 'react-native-svg';
import { buildLineAndAreaGeometry } from './chartUtils';

interface FluctuationsEducationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

// Dados de exemplo mostrando flutuações típicas de peso
const fluctuationData = [
  { day: 1, weight: 80.0 },
  { day: 2, weight: 81.2 }, // +1.2kg (retenção líquidos)
  { day: 3, weight: 80.5 }, // -0.7kg
  { day: 4, weight: 80.8 }, // +0.3kg
  { day: 5, weight: 79.6 }, // -1.2kg (grande variação)
  { day: 6, weight: 80.2 }, // +0.6kg
  { day: 7, weight: 79.8 }, // -0.4kg (tendência geral: ↓)
];

export function FluctuationsEducationScreen({ onNext, onBack }: FluctuationsEducationScreenProps) {
  const colors = useThemeColors();
  const { currentAccent } = useTheme();

  const chartWidth = useMemo(() => Dimensions.get('window').width - 80, []);
  const chartHeight = 180;
  const padding = useMemo(() => ({ top: 16, right: 24, bottom: 36, left: 60 }), []);
  const yTicks = [78, 79, 80, 81, 82];
  const xTicks = [1, 2, 3, 4, 5, 6, 7];

  const geometry = useMemo(
    () =>
      buildLineAndAreaGeometry(fluctuationData, {
        width: chartWidth,
        height: chartHeight,
        padding,
        xKey: 'day',
        yKey: 'weight',
        xDomain: [1, 7],
        yDomain: [78, 82],
      }),
    [chartWidth, padding],
  );

  const safeZonePath = useMemo(() => {
    const firstDay = 1;
    const lastDay = 7;
    const xStart = geometry.xScale(firstDay);
    const xEnd = geometry.xScale(lastDay);
    const upperY = geometry.yScale(82);
    const lowerY = geometry.yScale(78);

    return `M${xStart} ${upperY} L${xEnd} ${upperY} L${xEnd} ${lowerY} L${xStart} ${lowerY} Z`;
  }, [geometry]);

  return (
    <OnboardingScreenBase
      title="É normal ter flutuações"
      subtitle="Seu peso pode variar de um dia para o outro, e está tudo bem"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Entendi"
    >
      <View style={styles.content}>
        <Card variant="elevated" style={styles.graphCard}>
          <Text style={[styles.graphTitle, { color: colors.text }]}>
            Flutuações típicas de peso
          </Text>

          <Svg height={chartHeight} width={chartWidth}>
            {/* Grid lines */}
            {yTicks.map((value) => (
              <SvgLine
                key={`y-${value}`}
                x1={padding.left}
                x2={chartWidth - padding.right}
                y1={geometry.yScale(value)}
                y2={geometry.yScale(value)}
                stroke={colors.border}
                strokeDasharray="2 2"
                strokeOpacity={0.5}
              />
            ))}

            {/* Safe zone */}
            <Path d={safeZonePath} fill={colors.textMuted} opacity={0.1} />

            {/* Axes */}
            <SvgLine
              x1={padding.left}
              x2={padding.left}
              y1={padding.top}
              y2={geometry.baselineY}
              stroke={colors.border}
            />
            <SvgLine
              x1={padding.left}
              x2={chartWidth - padding.right}
              y1={geometry.baselineY}
              y2={geometry.baselineY}
              stroke={colors.border}
            />

            {/* Weight line */}
            <Path d={geometry.linePath} stroke={currentAccent} strokeWidth={3} fill="none" />

            {/* Data points */}
            {fluctuationData.map((point) => (
              <Circle
                key={point.day}
                cx={geometry.xScale(point.day)}
                cy={geometry.yScale(point.weight)}
                r={3}
                fill={colors.card}
                stroke={currentAccent}
                strokeWidth={1.5}
              />
            ))}

            {/* Tick labels */}
            {yTicks.map((value) => (
              <SvgText
                key={`y-label-${value}`}
                x={padding.left - 10}
                y={geometry.yScale(value) + 4}
                fill={colors.textMuted}
                fontSize={10}
                textAnchor="end"
              >
                {`${value}kg`}
              </SvgText>
            ))}
            {xTicks.map((value) => (
              <SvgText
                key={`x-label-${value}`}
                x={geometry.xScale(value)}
                y={geometry.baselineY + 18}
                fill={colors.textMuted}
                fontSize={10}
                textAnchor="middle"
              >
                {value}
              </SvgText>
            ))}

            {/* Axis label */}
            <SvgText
              x={(padding.left + chartWidth - padding.right) / 2}
              y={geometry.baselineY + 34}
              fill={colors.textSecondary}
              fontSize={12}
              textAnchor="middle"
            >
              Dias
            </SvgText>
          </Svg>

          <Text style={[styles.graphCaption, { color: colors.textMuted }]}>
            Variações de até 2kg são completamente normais
          </Text>
        </Card>

        <Card style={styles.factorsCard}>
          <Text style={[styles.factorsTitle, { color: colors.text }]}>
            Fatores que afetam o peso diário:
          </Text>
          <View style={styles.factorsList}>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>💧</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Retenção de líquidos
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>🍽️</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Última refeição
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>😴</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Qualidade do sono
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>🏃</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Exercícios recentes
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>🧂</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Consumo de sódio
              </Text>
            </View>
          </View>
        </Card>

        <Card style={[styles.tipCard, { borderLeftColor: currentAccent }]}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Foque na tendência geral, não nos números diários. O que importa é a
            direção que você está seguindo ao longo das semanas.
          </Text>
        </Card>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  graphCard: {
    padding: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  graphCaption: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  factorsCard: {
    padding: 20,
  },
  factorsTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  factorsList: {
    gap: 12,
  },
  factor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  factorEmoji: {
    fontSize: 24,
  },
  factorText: {
    fontSize: 15,
    flex: 1,
  },
  tipCard: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});

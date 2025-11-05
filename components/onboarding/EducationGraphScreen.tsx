import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line as SvgLine,
  Text as SvgText,
  Circle,
} from 'react-native-svg';
import { buildLineAndAreaGeometry } from './chartUtils';

interface EducationGraphScreenProps {
  onNext: () => void;
  onBack: () => void;
}

// Dados farmacocinéticos realistas para Mounjaro/GLP-1
// Baseado em estudos clínicos (simplificados para visualização educacional)
const pharmacokineticData = [
  { day: 0, level: 0 },
  { day: 1, level: 0.3 },
  { day: 2, level: 0.7 },
  { day: 3, level: 1.1 },
  { day: 4, level: 1.2 }, // Pico (Tmax ~96h)
  { day: 5, level: 0.9 },
  { day: 6, level: 0.6 },
  { day: 7, level: 0.3 }, // Antes da próxima dose
];

export function EducationGraphScreen({ onNext, onBack }: EducationGraphScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();

  const chartWidth = useMemo(() => Dimensions.get('window').width - 64, []);
  const chartHeight = 220;
  const padding = useMemo(() => ({ top: 24, right: 24, bottom: 44, left: 60 }), []);
  const yTicks = [0, 0.5, 1.0, 1.5];
  const xTicks = [0, 2, 4, 6, 7];

  const geometry = useMemo(
    () =>
      buildLineAndAreaGeometry(pharmacokineticData, {
        width: chartWidth,
        height: chartHeight,
        padding,
        xKey: 'day',
        yKey: 'level',
        xDomain: [0, 7],
        yDomain: [0, 1.5],
      }),
    [chartWidth, padding],
  );

  const peakPoint = { day: 4, level: 1.2 };
  const peakX = geometry.xScale(peakPoint.day);
  const peakY = geometry.yScale(peakPoint.level);
  const yAxisLabelCenter =
    padding.top + (geometry.baselineY - padding.top) / 2;

  return (
    <OnboardingScreenBase
      title="Entenda seus níveis estimados"
      subtitle="Veja como o medicamento age no seu corpo ao longo do tempo"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Entendi"
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.graphCard}>
          <Svg height={chartHeight} width={chartWidth}>
            <Defs>
              <LinearGradient id="educationGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={currentAccent} stopOpacity={0.4} />
                <Stop offset="100%" stopColor={currentAccent} stopOpacity={0.05} />
              </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {yTicks.map((value) => {
              const y = geometry.yScale(value);
              return (
                <SvgLine
                  key={`y-${value}`}
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={y}
                  y2={y}
                  stroke={colors.border}
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
              );
            })}

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

            {/* Area and line */}
            <Path d={geometry.areaPath} fill="url(#educationGradient)" />
            <Path d={geometry.linePath} stroke={currentAccent} strokeWidth={2} fill="none" />

            {/* Peak marker */}
            <Circle cx={peakX} cy={peakY} r={6} fill={currentAccent} />

            {/* Axis labels */}
            <SvgText
              x={padding.left - 38}
              y={yAxisLabelCenter}
              fill={colors.textSecondary}
              fontSize={12}
              textAnchor="middle"
              transform={`rotate(-90 ${padding.left - 38} ${yAxisLabelCenter})`}
            >
              Nível (mg)
            </SvgText>
            <SvgText
              x={(padding.left + chartWidth - padding.right) / 2}
              y={geometry.baselineY + 30}
              fill={colors.textSecondary}
              fontSize={12}
              textAnchor="middle"
            >
              Dias
            </SvgText>

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
                {value.toFixed(1)}
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
          </Svg>

          {/* Label do pico */}
          <Text style={[styles.peakLabel, { color: currentAccent }]}>
            ← Pico: 1.2mg (dia 4)
          </Text>
        </ShotsyCard>

        <ShotsyCard style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            Como funciona?
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Após cada aplicação, o nível do medicamento aumenta gradualmente e depois diminui ao longo dos dias. O gráfico acima mostra uma estimativa desses níveis.
          </Text>
        </ShotsyCard>

        <ShotsyCard style={[styles.warningCard, { backgroundColor: colors.card }]}>
          <Text style={styles.warningEmoji}>💡</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            Essas estimativas são baseadas em dados clínicos e podem variar de pessoa para pessoa. Sempre siga as orientações do seu médico.
          </Text>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  graphCard: {
    padding: 20,
  },
  peakLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: -40, // Sobrepor ao gráfico
    marginRight: 20,
  },
  infoCard: {
    padding: 20, // Mudança: 16 → 20px (match Shotsy)
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  warningCard: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  warningEmoji: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});

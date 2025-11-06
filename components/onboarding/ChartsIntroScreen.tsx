import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTheme } from '@/lib/theme-context';
import { Card } from '@/components/ui/card';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line as SvgLine,
  Text as SvgText,
} from 'react-native-svg';
import { buildLineAndAreaGeometry } from './chartUtils';

interface ChartsIntroScreenProps {
  onNext: () => void;
  onBack: () => void;
}

// Dados de exemplo para o chart preview
const sampleChartData = [
  { x: 0, y: 0.2 },
  { x: 1, y: 0.5 },
  { x: 2, y: 0.9 },
  { x: 3, y: 1.16 }, // Pico
  { x: 4, y: 0.8 },
  { x: 5, y: 0.6 },
  { x: 6, y: 0.4 },
  { x: 7, y: 0.2 },
];

export function ChartsIntroScreen({ onNext, onBack }: ChartsIntroScreenProps) {
  const colors = useThemeColors();
  const { currentAccent } = useTheme();

  const chartWidth = useMemo(() => Dimensions.get('window').width - 64, []);
  const chartHeight = 200;
  const padding = useMemo(() => ({ top: 16, right: 20, bottom: 32, left: 44 }), []);
  const yTicks = [0, 0.5, 1.0, 1.5];
  const xTicks = [0, 2, 4, 6, 7];

  const geometry = useMemo(
    () =>
      buildLineAndAreaGeometry(sampleChartData, {
        width: chartWidth,
        height: chartHeight,
        padding,
        xKey: 'x',
        yKey: 'y',
        xDomain: [0, 7],
        yDomain: [0, 1.5],
      }),
    [chartWidth, padding],
  );

  return (
    <OnboardingScreenBase
      title="Mounjaro Tracker pode ajudar você a entender sua jornada através de ferramentas educativas"
      subtitle="Sinta-se mais confiante aprendendo como o medicamento funciona no seu corpo."
      onNext={onNext}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Card variant="elevated" style={styles.chartPreview}>
          <Svg height={chartHeight} width={chartWidth}>
            <Defs>
              <LinearGradient id="chartsIntroGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={currentAccent} stopOpacity={0.35} />
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

            {/* Area + line */}
            <Path d={geometry.areaPath} fill="url(#chartsIntroGradient)" />
            <Path d={geometry.linePath} stroke={currentAccent} strokeWidth={2} fill="none" />

            {/* Y tick labels */}
            {yTicks.map((value) => (
              <SvgText
                key={`y-label-${value}`}
                x={padding.left - 8}
                y={geometry.yScale(value) + 4}
                fill={colors.textMuted}
                fontSize={10}
                textAnchor="end"
              >
                {value.toFixed(1)}
              </SvgText>
            ))}

            {/* X tick labels */}
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

          <Text style={[styles.chartAnnotation, { color: colors.text }]}>
            1.16mg
              </Text>
          <Text style={[styles.chartTimestamp, { color: colors.textMuted }]}>
            28 de out. de 2025, 10
              </Text>
        </Card>

        <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
          Mounjaro Tracker usa resultados de ensaios clínicos publicados pela FDA 
          para mapear os níveis estimados de medicação ao longo do tempo
              </Text>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  chartPreview: {
    padding: 20,
    marginBottom: 16,
  },
  chartAnnotation: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -30,
  },
  chartTimestamp: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

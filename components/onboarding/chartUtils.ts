type Padding = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

interface GeometryOptions<T extends Record<string, number>> {
  width: number;
  height: number;
  padding?: Padding;
  xKey: keyof T;
  yKey: keyof T;
  xDomain?: [number, number];
  yDomain?: [number, number];
}

interface GeometryResult<T extends Record<string, number>> {
  linePath: string;
  areaPath: string;
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  baselineY: number;
  firstPoint: T | undefined;
  lastPoint: T | undefined;
}

const clampDomain = (min: number, max: number) => {
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return [0, 1] as const;
  }
  if (min === max) {
    return [min, min + 1] as const;
  }
  return [min, max] as const;
};

export function buildLineAndAreaGeometry<T extends Record<string, number>>(
  dataPoints: T[],
  options: GeometryOptions<T>,
): GeometryResult<T> {
  const { width, height, xKey, yKey } = options;
  const padding: Required<Padding> = {
    top: options.padding?.top ?? 0,
    right: options.padding?.right ?? 0,
    bottom: options.padding?.bottom ?? 0,
    left: options.padding?.left ?? 0,
  };

  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);

  const numericData = dataPoints.filter(
    (point) => typeof point[xKey] === 'number' && typeof point[yKey] === 'number',
  );

  const xValues = numericData.map((point) => point[xKey] as number);
  const yValues = numericData.map((point) => point[yKey] as number);

  const [computedXMin, computedXMax] = clampDomain(
    options.xDomain?.[0] ?? Math.min(...xValues, 0),
    options.xDomain?.[1] ?? Math.max(...xValues, 1),
  );
  const [computedYMin, computedYMax] = clampDomain(
    options.yDomain?.[0] ?? Math.min(...yValues, 0),
    options.yDomain?.[1] ?? Math.max(...yValues, 1),
  );

  const xScale = (value: number) => {
    const ratio = (value - computedXMin) / (computedXMax - computedXMin);
    return padding.left + ratio * innerWidth;
  };

  const yScale = (value: number) => {
    const ratio = (value - computedYMin) / (computedYMax - computedYMin);
    return padding.top + innerHeight - ratio * innerHeight;
  };

  const linePath = numericData.reduce((path, point, index) => {
    const x = xScale(point[xKey] as number);
    const y = yScale(point[yKey] as number);
    const command = index === 0 ? 'M' : 'L';
    return `${path}${command}${x} ${y}`;
  }, '');

  const firstPoint = numericData[0];
  const lastPoint = numericData[numericData.length - 1];
  const baselineY = yScale(computedYMin);

  const areaPath =
    !firstPoint || !lastPoint
      ? ''
      : `${linePath} L${xScale(lastPoint[xKey] as number)} ${baselineY} L${xScale(
          firstPoint[xKey] as number,
        )} ${baselineY} Z`;

  return {
    linePath,
    areaPath,
    xScale,
    yScale,
    xMin: computedXMin,
    xMax: computedXMax,
    yMin: computedYMin,
    yMax: computedYMax,
    baselineY,
    firstPoint,
    lastPoint,
  };
}


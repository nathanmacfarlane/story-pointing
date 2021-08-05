interface Offset {
  color: string;
  dashArray: string;
  dashOffset: string;
}

const COLORS = [
  '#005f73',
  '#0a9396',
  '#94d2bd',
  '#e9d8a6',
  '#ee9b00',
  '#ca6702',
  '#bb3e03',
  '#ae2012',
  '#9b2226',
].sort(() => Math.random() - 0.5);

const getCircles = (values: number[]): Offset[] => {
  const totalSum = values.reduce((prev, current) => prev + current, 0);
  const adjustedStrokes = values.map((stroke) => (100 / totalSum) * stroke);
  const offsets: Offset[] = [];
  let previousSum: number = 0;
  let index = 0;
  for (const count of adjustedStrokes) {
    offsets.push({
      color: COLORS[index],
      dashArray: `${count} ${100 - count}`,
      dashOffset: `${100 - previousSum}`,
    });
    previousSum += count;
    index++;
  }
  return offsets;
};

export const DonutChart = ({ values }: { values: number[] }) => {
  const radius = '15.91549430918954';
  const offsets = getCircles(values);

  const sum = values.reduce((prev, current) => prev + current, 0);
  const average = Math.ceil(sum / values.length);

  return (
    <svg width='100%' height='100%' viewBox='0 0 42 42' className='donut'>
      <circle
        className='donut-hole'
        cx='21'
        cy='21'
        r={radius}
        fill='transparent'
      />
      <circle
        className='donut-ring'
        cx='21'
        cy='21'
        r={radius}
        fill='transparent'
        stroke='#999999'
        strokeWidth='3'
      />
      {offsets.map(({ color, dashArray, dashOffset }, index) => {
        return (
          <circle
            key={color}
            className='donut-segment'
            cx='21'
            cy='21'
            r={radius}
            fill='transparent'
            stroke={color}
            strokeWidth='3'
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        );
      })}
      <g className='chart-text'>
        <text x='50%' y='50%' className='chart-number' fill='white'>
          {average}
        </text>
        <text x='50%' y='50%' className='chart-label' fill='white'>
          Points
        </text>
      </g>
    </svg>
  );
};

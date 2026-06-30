import Svg, { Path, Ellipse, Defs, LinearGradient as SvgGradient, Stop, G, Circle } from 'react-native-svg';

const CONTINENT_DATA = {
  europe: {
    viewBox: '0 0 100 100',
    paths: [
      // Main body - Western Europe mainland
      'M30,8 C35,5 45,3 52,6 C58,8 62,5 68,8 C74,11 78,15 76,22 C74,28 78,32 76,38 C74,44 70,48 66,52 C62,56 58,62 54,66 C50,70 46,72 42,68 C38,64 34,62 30,58 C26,54 22,48 24,42 C26,36 22,32 24,26 C26,20 28,14 30,8 Z',
      // Scandinavian peninsula
      'M52,2 C56,0 62,2 64,6 C66,10 68,6 70,4 C72,2 74,6 72,10 C70,14 72,18 68,16 C64,14 60,12 56,10 C52,8 50,4 52,2 Z',
      // Iberian peninsula
      'M24,52 C20,56 18,62 20,68 C22,72 26,74 30,72 C34,70 36,66 34,62 C32,58 28,54 24,52 Z',
      // Italian boot
      'M54,54 C56,58 58,64 56,70 C54,74 52,76 50,74 C48,72 50,66 52,62 C54,58 54,56 54,54 Z',
      // British Isles
      'M22,20 C24,18 28,18 28,22 C28,26 26,28 24,28 C22,28 20,24 22,20 Z',
      // Iceland
      'M16,6 C18,4 22,4 22,8 C22,10 20,12 18,10 C16,8 16,8 16,6 Z',
    ],
    colors: {
      gradient: ['#4A6CF7', '#6C8EF5', '#93B0FF'],
      stroke: '#3451B2',
      glow: '#4A6CF7',
    },
  },
  asia: {
    viewBox: '0 0 120 100',
    paths: [
      // Main body - massive landmass
      'M8,20 C12,12 22,6 34,4 C46,2 58,2 70,4 C82,6 92,10 100,16 C108,22 114,30 112,40 C110,50 106,56 100,60 C94,64 88,62 82,66 C76,70 70,72 64,68 C58,64 52,68 46,72 C40,76 34,74 28,70 C22,66 16,60 12,52 C8,44 6,36 8,28 C10,24 8,22 8,20 Z',
      // Indian subcontinent
      'M46,68 C50,72 54,78 52,86 C50,92 46,96 42,94 C38,92 36,86 38,80 C40,74 44,70 46,68 Z',
      // SE Asia peninsula
      'M76,66 C78,72 80,78 78,84 C76,88 74,86 72,82 C70,78 72,72 76,66 Z',
      // Korean peninsula
      'M96,38 C98,42 100,48 98,52 C96,54 94,52 94,48 C94,44 94,40 96,38 Z',
      // Japanese archipelago
      'M104,30 C106,34 108,40 106,46 C104,50 102,48 102,44 C102,38 102,32 104,30 Z',
      // Sri Lanka
      'M48,88 C50,88 50,92 48,92 C46,92 46,88 48,88 Z',
    ],
    colors: {
      gradient: ['#E8590C', '#F76707', '#FF922B'],
      stroke: '#C92A2A',
      glow: '#E8590C',
    },
  },
  africa: {
    viewBox: '0 0 80 100',
    paths: [
      // Main body - iconic shape
      'M24,4 C32,2 42,2 50,4 C58,6 64,12 66,20 C68,28 68,36 66,44 C64,52 62,60 58,68 C54,76 48,84 42,90 C38,94 34,96 30,94 C26,92 24,86 22,80 C20,74 18,66 16,58 C14,50 14,42 16,34 C18,26 18,16 20,10 C22,6 22,4 24,4 Z',
      // Horn of Africa
      'M58,44 C62,42 66,44 68,48 C70,52 68,56 64,54 C60,52 58,48 58,44 Z',
      // Madagascar
      'M64,64 C66,62 68,64 68,70 C68,76 66,78 64,76 C62,74 62,68 64,64 Z',
    ],
    colors: {
      gradient: ['#2B8A3E', '#40C057', '#69DB7C'],
      stroke: '#1B5E20',
      glow: '#2B8A3E',
    },
  },
  'north-america': {
    viewBox: '0 0 100 100',
    paths: [
      // Main body - wide top, narrowing south
      'M8,10 C14,6 24,4 36,2 C48,0 60,2 72,6 C80,10 86,16 88,24 C90,32 86,38 82,44 C78,50 72,54 66,58 C60,62 56,66 52,72 C48,78 44,82 40,84 C36,86 32,84 30,80 C28,76 26,70 24,64 C22,58 18,52 14,48 C10,44 6,38 4,30 C2,22 4,14 8,10 Z',
      // Alaska
      'M4,8 C8,4 14,2 18,6 C20,10 16,14 12,14 C8,14 4,12 4,8 Z',
      // Florida
      'M52,70 C54,74 56,80 54,84 C52,86 50,84 50,80 C50,76 50,72 52,70 Z',
      // Greenland
      'M62,0 C68,0 74,2 76,6 C78,10 76,14 72,14 C68,14 64,12 62,8 C60,4 60,2 62,0 Z',
    ],
    colors: {
      gradient: ['#1864AB', '#228BE6', '#4DABF7'],
      stroke: '#0B4A8A',
      glow: '#1864AB',
    },
  },
  'south-america': {
    viewBox: '0 0 70 100',
    paths: [
      // Main body - pear shape
      'M22,4 C30,2 40,2 48,6 C54,10 58,18 58,28 C58,38 56,48 52,58 C48,68 42,78 36,86 C32,92 28,96 24,94 C20,92 18,86 16,78 C14,70 12,62 12,52 C12,42 12,32 14,24 C16,16 18,8 22,4 Z',
      // Falkland Islands
      'M34,94 C36,94 38,96 36,98 C34,98 32,96 34,94 Z',
    ],
    colors: {
      gradient: ['#7048E8', '#845EF7', '#B197FC'],
      stroke: '#5F3DC4',
      glow: '#7048E8',
    },
  },
  'central-america': {
    viewBox: '0 0 100 70',
    paths: [
      // Central American isthmus
      'M4,20 C10,16 18,14 26,16 C34,18 40,22 48,24 C56,26 62,28 68,26 C72,24 74,20 72,16 Z',
      // Mexico connection (wider)
      'M4,20 C8,24 12,28 16,30 C20,32 26,30 30,28 C34,26 36,24 40,24 Z',
      // Caribbean - Cuba
      'M38,8 C44,6 52,6 56,10 C58,14 54,16 50,14 C46,12 42,12 38,8 Z',
      // Caribbean - Hispaniola
      'M60,10 C64,8 68,10 68,14 C68,16 64,16 62,14 C60,12 60,12 60,10 Z',
      // Caribbean - Puerto Rico
      'M72,12 C74,10 76,12 76,14 C76,16 74,16 72,14 Z',
      // Panama
      'M68,26 C74,28 80,32 84,36 C86,40 84,44 80,42 C76,40 72,36 70,32 C68,30 68,28 68,26 Z',
      // Jamaica
      'M46,16 C48,14 52,16 50,18 C48,20 44,18 46,16 Z',
      // Lesser Antilles chain
      'M78,14 C80,16 82,20 80,24 C78,22 76,18 78,14 Z',
    ],
    colors: {
      gradient: ['#087F5B', '#0CA678', '#38D9A9'],
      stroke: '#055A3E',
      glow: '#087F5B',
    },
  },
  oceania: {
    viewBox: '0 0 100 80',
    paths: [
      // Australia main body
      'M10,22 C16,16 26,12 36,14 C46,16 54,14 62,18 C68,22 72,28 70,36 C68,44 66,50 60,56 C54,60 46,62 38,60 C30,58 22,54 16,48 C10,42 8,34 8,28 C8,24 10,22 10,22 Z',
      // Cape York Peninsula
      'M52,14 C54,10 58,8 60,12 C62,16 58,18 56,16 C54,14 52,14 52,14 Z',
      // Tasmania
      'M52,62 C56,60 58,64 56,68 C54,70 50,68 52,64 Z',
    ],
    extras: [
      // New Zealand North Island
      { type: 'path', d: 'M80,20 C84,16 88,18 88,24 C88,30 86,34 82,32 C78,30 78,24 80,20 Z' },
      // New Zealand South Island
      { type: 'path', d: 'M78,36 C82,34 86,36 86,42 C86,48 84,52 80,50 C76,48 76,42 78,36 Z' },
      // Papua New Guinea
      { type: 'path', d: 'M56,4 C60,2 66,2 68,6 C70,10 66,12 62,10 C58,8 56,6 56,4 Z' },
    ],
    colors: {
      gradient: ['#C92A2A', '#E03131', '#FF6B6B'],
      stroke: '#A51D1D',
      glow: '#C92A2A',
    },
  },
  'turkish-cuisine': {
    viewBox: '0 0 100 80',
    paths: [
      // Anatolian plateau (Turkey)
      'M8,10 C16,6 28,4 40,8 C48,10 50,14 46,18 C42,22 36,20 30,18 C24,16 16,16 10,18 C6,16 6,12 8,10 Z',
      // Arabian Peninsula
      'M38,22 C46,18 56,16 64,20 C72,24 78,32 76,42 C74,52 68,60 60,64 C52,66 44,62 40,54 C36,46 34,38 36,30 C36,26 38,22 38,22 Z',
      // Iran/Persia
      'M64,12 C72,8 82,10 88,16 C92,22 90,30 84,34 C78,36 72,32 68,26 C64,22 62,16 64,12 Z',
      // Persian Gulf
      'M56,30 C60,28 64,30 62,34 C60,36 56,34 56,30 Z',
    ],
    colors: {
      gradient: ['#E67700', '#F59F00', '#FFD43B'],
      stroke: '#C06000',
      glow: '#E67700',
    },
  },
};

export default function ContinentShape({ continentId, size = 60, selected = false, style }) {
  const data = CONTINENT_DATA[continentId] || CONTINENT_DATA.europe;
  const gradientId = `grad_${continentId}`;

  const opacity = selected ? 1 : 0.85;
  const strokeWidth = selected ? 1.2 : 0.6;
  const strokeOpacity = selected ? 0.9 : 0.4;

  // Parse viewBox to get aspect ratio
  const vbParts = data.viewBox.split(' ').map(Number);
  const vbWidth = vbParts[2];
  const vbHeight = vbParts[3];
  const aspectRatio = vbWidth / vbHeight;

  const svgWidth = size;
  const svgHeight = size / aspectRatio;

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
      viewBox={data.viewBox}
      style={[{ overflow: 'visible' }, style]}
    >
      <Defs>
        <SvgGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={data.colors.gradient[0]} stopOpacity={opacity} />
          <Stop offset="50%" stopColor={data.colors.gradient[1]} stopOpacity={opacity} />
          <Stop offset="100%" stopColor={data.colors.gradient[2]} stopOpacity={opacity * 0.9} />
        </SvgGradient>
      </Defs>

      <G>
        {/* Main continent paths */}
        {data.paths.map((pathD, idx) => (
          <Path
            key={idx}
            d={pathD}
            fill={`url(#${gradientId})`}
            stroke={data.colors.stroke}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Extra shapes (islands etc) */}
        {data.extras?.map((extra, idx) => {
          if (extra.type === 'ellipse') {
            return (
              <Ellipse
                key={`extra-${idx}`}
                cx={extra.cx}
                cy={extra.cy}
                rx={extra.rx}
                ry={extra.ry}
                fill={`url(#${gradientId})`}
                stroke={data.colors.stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
              />
            );
          }
          if (extra.type === 'path') {
            return (
              <Path
                key={`extra-${idx}`}
                d={extra.d}
                fill={`url(#${gradientId})`}
                stroke={data.colors.stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          }
          if (extra.type === 'circle') {
            return (
              <Circle
                key={`extra-${idx}`}
                cx={extra.cx}
                cy={extra.cy}
                r={extra.r}
                fill={`url(#${gradientId})`}
                stroke={data.colors.stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
              />
            );
          }
          return null;
        })}

        {/* Selection highlight overlay */}
        {selected && data.paths.map((pathD, idx) => (
          <Path
            key={`highlight-${idx}`}
            d={pathD}
            fill="rgba(255,255,255,0.15)"
            stroke="none"
          />
        ))}
      </G>
    </Svg>
  );
}

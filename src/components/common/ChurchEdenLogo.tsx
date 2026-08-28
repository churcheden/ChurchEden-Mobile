import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ChurchEdenLogoProps {
  size?: number;
  color?: string;
}

export function ChurchEdenLogo({ size = 130, color = '#C98A16' }: ChurchEdenLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Defs>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#DAA520" />
          <Stop offset="50%" stopColor="#C98A16" />
          <Stop offset="100%" stopColor="#B0750C" />
        </LinearGradient>
      </Defs>

      <G fill={color}>
        {/* Central 'C' Emblem */}
        <Path
          d="M 118 78 A 28 28 0 1 0 118 122"
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* TOP-LEFT QUADRANT ARCS */}
        {/* Outer Arc TL */}
        <Path
          d="M 94 14 A 86 86 0 0 0 14 94 L 32 94 A 68 68 0 0 1 94 32 Z"
        />
        {/* Inner Arc TL */}
        <Path
          d="M 94 44 A 56 56 0 0 0 44 94 L 58 94 A 42 42 0 0 1 94 58 Z"
        />

        {/* TOP-RIGHT QUADRANT ARCS */}
        {/* Outer Arc TR */}
        <Path
          d="M 106 14 A 86 86 0 0 1 186 94 L 168 94 A 68 68 0 0 0 106 32 Z"
        />
        {/* Inner Arc TR */}
        <Path
          d="M 106 44 A 56 56 0 0 1 156 94 L 142 94 A 42 42 0 0 0 106 58 Z"
        />

        {/* BOTTOM-LEFT QUADRANT ARCS */}
        {/* Outer Arc BL */}
        <Path
          d="M 14 106 A 86 86 0 0 0 94 186 L 94 168 A 68 68 0 0 1 32 106 Z"
        />
        {/* Inner Arc BL */}
        <Path
          d="M 44 106 A 56 56 0 0 0 94 156 L 94 142 A 42 42 0 0 1 58 106 Z"
        />

        {/* BOTTOM-RIGHT QUADRANT ARCS */}
        {/* Outer Arc BR */}
        <Path
          d="M 186 106 A 86 86 0 0 1 106 186 L 106 168 A 68 68 0 0 0 168 106 Z"
        />
        {/* Inner Arc BR */}
        <Path
          d="M 156 106 A 56 56 0 0 1 106 156 L 106 142 A 42 42 0 0 0 142 106 Z"
        />
      </G>
    </Svg>
  );
}

export default ChurchEdenLogo;

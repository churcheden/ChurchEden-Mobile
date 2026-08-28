import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

// Official ChurchEden transparent PNG logo asset used across Splash, Onboarding, and Home.
export const CHURCH_EDEN_LOGO_SRC = require('../../assets/images/Just-logo-transparent.png');

interface ChurchEdenLogoProps {
  size?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  fadeDuration?: number;
}

/**
 * Reusable official ChurchEden Logo component.
 * Renders the single source of truth PNG asset with instant zero-fade rendering.
 */
export function ChurchEdenLogo({
  size = 130,
  width,
  height,
  style,
  fadeDuration = 0,
}: ChurchEdenLogoProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <Image
      source={CHURCH_EDEN_LOGO_SRC}
      style={[{ width: w, height: h }, style]}
      resizeMode="contain"
      fadeDuration={fadeDuration}
    />
  );
}

export default ChurchEdenLogo;

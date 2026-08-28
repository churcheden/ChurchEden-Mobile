import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Church as ChurchIcon,
  Leaf,
  BookOpen,
  Heart,
  Mountain,
  Crown,
  Cross,
  Sparkles,
} from 'lucide-react-native';

interface ChurchIconBadgeProps {
  type?: 'cross' | 'leaf' | 'bible' | 'heart' | 'mountain' | 'crown' | 'church';
  bgColor?: string;
  size?: number;
}

export function ChurchIconBadge({
  type = 'church',
  bgColor = '#07182F',
  size = 52,
}: ChurchIconBadgeProps) {
  const iconSize = Math.round(size * 0.48);

  const renderIcon = () => {
    switch (type) {
      case 'leaf':
        return <Leaf size={iconSize} color="#FFFFFF" strokeWidth={2.2} />;
      case 'bible':
        return <BookOpen size={iconSize} color="#FFFFFF" strokeWidth={2.2} />;
      case 'heart':
        return <Heart size={iconSize} color="#FFFFFF" strokeWidth={2.2} fill="transparent" />;
      case 'mountain':
        return <Mountain size={iconSize} color="#FFFFFF" strokeWidth={2.2} />;
      case 'crown':
        return <Crown size={iconSize} color="#FFFFFF" strokeWidth={2.2} />;
      case 'cross':
        return <Cross size={iconSize} color="#FFFFFF" strokeWidth={2.2} />;
      case 'church':
      default:
        return <ChurchIcon size={iconSize} color="#FFFFFF" strokeWidth={2.2} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          backgroundColor: bgColor,
        },
      ]}
    >
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default ChurchIconBadge;

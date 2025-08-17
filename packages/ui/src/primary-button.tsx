import React from 'react';
import { Platform, Pressable, Text, ViewStyle } from 'react-native';

export type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress, disabled, style }) => {
  const baseStyle: ViewStyle = {
    backgroundColor: disabled ? '#9ca3af' : '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  };

  return (
    <Pressable disabled={disabled} onPress={onPress} style={[baseStyle, style] as any} accessibilityRole={Platform.OS === 'web' ? 'button' : undefined}>
      <Text style={{ color: '#ffffff', fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
};
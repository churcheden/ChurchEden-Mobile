import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { ReactionType } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';

interface ReactionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectReaction: (type: ReactionType) => void;
}

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'amen', emoji: '🙏', label: 'Amen' },
  { type: 'celebrate', emoji: '👏', label: 'Celebrate' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
];

export function ReactionPickerModal({
  visible,
  onClose,
  onSelectReaction,
}: ReactionPickerModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.pickerContainer}>
          {REACTIONS.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={styles.reactionButton}
              activeOpacity={0.7}
              onPress={() => {
                onSelectReaction(item.type);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={`React with ${item.label}`}
            >
              <Text style={styles.emojiText}>{item.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MemberTheme.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 12,
  },
  reactionButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 28,
  },
});

export default ReactionPickerModal;

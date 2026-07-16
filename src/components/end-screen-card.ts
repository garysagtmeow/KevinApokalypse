import { StyleSheet } from 'react-native';

export const endScreenCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 245, 220, 0.95)',
    borderWidth: 3,
    borderColor: '#3D2914',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 340,
    minHeight: 230,
    maxWidth: '90%',
    transform: [{ rotate: '-1deg' }],
    shadowColor: '#3D2914',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

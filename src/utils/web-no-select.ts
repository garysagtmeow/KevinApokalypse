import { Platform } from 'react-native';

export const WEB_NO_SELECT_STYLE = Platform.select({
  web: {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    touchAction: 'manipulation',
  } as object,
  default: {},
});

export const WEB_PRESSABLE_PROPS = Platform.select({
  web: {
    onContextMenu: (event: { preventDefault: () => void }) => {
      event.preventDefault();
    },
  },
  default: {},
});

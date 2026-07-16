import { Platform } from 'react-native';

export const IS_WEB = Platform.OS === 'web';

/** Throttle visual React updates on web — native keeps every frame. */
export const WEB_POSITION_SYNC_MS = 32;

export const WEB_MIEF_TICK_MS = 100;

export const WEB_IDLE_POLL_MS = 120;

export function shouldSyncPosition(lastSyncMs: number, now: number): boolean {
  if (!IS_WEB) {
    return true;
  }

  return now - lastSyncMs >= WEB_POSITION_SYNC_MS;
}

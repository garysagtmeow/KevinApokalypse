export const TIMMY_CHOKE_DELAY_MIN_MS = 12000;
export const TIMMY_CHOKE_DELAY_MAX_MS = 17000;
export const TIMMY_BREATH_COUNTDOWN_SECONDS = 10;
export const TIMMY_RESCUE_HOLD_MS = 2000;

export const TIMMY_RESCUE_SUCCESS_QUOTE = 'Jetzt geht\'s wieder. Grillen wir morgen?';

export function randomTimmyChokeDelayMs(): number {
  return (
    TIMMY_CHOKE_DELAY_MIN_MS +
    Math.random() * (TIMMY_CHOKE_DELAY_MAX_MS - TIMMY_CHOKE_DELAY_MIN_MS)
  );
}

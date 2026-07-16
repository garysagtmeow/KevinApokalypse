import { useCallback, useEffect } from 'react';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioPlayer,
} from 'expo-audio';

const BONUS_SOUNDS = {
  cheesePling: require('@/assets/audio/sfx/cheese-pling.wav'),
  bonusMusic: require('@/assets/audio/music/bonus-loop.wav'),
} as const;

function replay(player: AudioPlayer) {
  player.seekTo(0);
  player.play();
}

export function useBonusSounds(musicActive: boolean, resetKey: number) {
  const cheesePlingPlayer = useAudioPlayer(BONUS_SOUNDS.cheesePling);
  const bonusMusicPlayer = useAudioPlayer(BONUS_SOUNDS.bonusMusic, {
    downloadFirst: true,
  });
  const bonusMusicStatus = useAudioPlayerStatus(bonusMusicPlayer);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    cheesePlingPlayer.volume = 0.9;
    bonusMusicPlayer.loop = true;
    bonusMusicPlayer.volume = 0.32;
  }, [bonusMusicPlayer, cheesePlingPlayer]);

  useEffect(() => {
    if (!musicActive) {
      if (bonusMusicPlayer.playing) {
        bonusMusicPlayer.pause();
        void bonusMusicPlayer.seekTo(0);
      }
      return;
    }

    if (!bonusMusicStatus.isLoaded || bonusMusicPlayer.playing) {
      return;
    }

    bonusMusicPlayer.play();
  }, [bonusMusicPlayer, bonusMusicStatus.isLoaded, musicActive]);

  useEffect(() => {
    if (bonusMusicPlayer.playing) {
      bonusMusicPlayer.pause();
      void bonusMusicPlayer.seekTo(0);
    }
  }, [resetKey, bonusMusicPlayer]);

  const playCheesePling = useCallback(() => {
    replay(cheesePlingPlayer);
  }, [cheesePlingPlayer]);

  return { playCheesePling };
}

import { useCallback, useEffect, useRef } from 'react';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioPlayer,
} from 'expo-audio';

const GAME_SOUNDS = {
  collect: require('@/assets/audio/sfx/collect.wav'),
  kevinDrop: require('@/assets/audio/sfx/kevin-drop.wav'),
  alarm: require('@/assets/audio/sfx/alarm.wav'),
  levelComplete: require('@/assets/audio/sfx/level-complete.wav'),
  gameOver: require('@/assets/audio/sfx/game-over.wav'),
  backgroundMusic: require('@/assets/audio/music/background-loop.wav'),
} as const;

const NORMAL_MUSIC_RATE = 1;
const HECTIC_MUSIC_RATE = 1.48;
const NORMAL_MUSIC_VOLUME = 0.28;
const HECTIC_MUSIC_VOLUME = 0.22;

type GameSoundOptions = {
  isPlaying: boolean;
  isCritical: boolean;
  isChoking?: boolean;
};

function replay(player: AudioPlayer) {
  player.seekTo(0);
  player.play();
}

function applyMusicRate(player: AudioPlayer, rate: number) {
  player.setPlaybackRate(rate);
}

export function useGameSounds({ isPlaying, isCritical, isChoking = false }: GameSoundOptions) {
  const collectPlayer = useAudioPlayer(GAME_SOUNDS.collect);
  const kevinDropPlayer = useAudioPlayer(GAME_SOUNDS.kevinDrop);
  const alarmPlayer = useAudioPlayer(GAME_SOUNDS.alarm);
  const levelCompletePlayer = useAudioPlayer(GAME_SOUNDS.levelComplete);
  const gameOverPlayer = useAudioPlayer(GAME_SOUNDS.gameOver);
  const backgroundMusicPlayer = useAudioPlayer(GAME_SOUNDS.backgroundMusic, {
    downloadFirst: true,
  });
  const backgroundMusicStatus = useAudioPlayerStatus(backgroundMusicPlayer);
  const alarmActiveRef = useRef(false);

  const isHectic = isCritical || isChoking;

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    collectPlayer.volume = 0.85;
    kevinDropPlayer.volume = 0.8;
    alarmPlayer.volume = 0.55;
    levelCompletePlayer.volume = 0.9;
    gameOverPlayer.volume = 0.85;
    alarmPlayer.loop = true;
    backgroundMusicPlayer.loop = true;
  }, [
    alarmPlayer,
    backgroundMusicPlayer,
    collectPlayer,
    gameOverPlayer,
    kevinDropPlayer,
    levelCompletePlayer,
  ]);

  useEffect(() => {
    if (!backgroundMusicStatus.isLoaded) {
      return;
    }

    applyMusicRate(
      backgroundMusicPlayer,
      isHectic ? HECTIC_MUSIC_RATE : NORMAL_MUSIC_RATE,
    );
    backgroundMusicPlayer.volume = isHectic ? HECTIC_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
  }, [backgroundMusicPlayer, backgroundMusicStatus.isLoaded, isHectic]);

  useEffect(() => {
    if (!isPlaying) {
      if (backgroundMusicPlayer.playing) {
        backgroundMusicPlayer.pause();
        void backgroundMusicPlayer.seekTo(0);
      }
      if (backgroundMusicStatus.isLoaded) {
        applyMusicRate(backgroundMusicPlayer, NORMAL_MUSIC_RATE);
      }
      return;
    }

    if (!backgroundMusicStatus.isLoaded || backgroundMusicPlayer.playing) {
      return;
    }

    backgroundMusicPlayer.loop = true;
    backgroundMusicPlayer.play();
  }, [
    backgroundMusicPlayer,
    backgroundMusicStatus.isLoaded,
    isPlaying,
  ]);

  const playCollect = useCallback(() => {
    replay(collectPlayer);
  }, [collectPlayer]);

  const playKevinDrop = useCallback(() => {
    replay(kevinDropPlayer);
  }, [kevinDropPlayer]);

  const startAlarm = useCallback(() => {
    if (alarmActiveRef.current) {
      return;
    }

    alarmActiveRef.current = true;
    alarmPlayer.loop = true;
    replay(alarmPlayer);
  }, [alarmPlayer]);

  const stopAlarm = useCallback(() => {
    if (!alarmActiveRef.current) {
      return;
    }

    alarmActiveRef.current = false;
    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
  }, [alarmPlayer]);

  const playLevelComplete = useCallback(() => {
    stopAlarm();
    replay(levelCompletePlayer);
  }, [levelCompletePlayer, stopAlarm]);

  const playGameOver = useCallback(() => {
    stopAlarm();
    replay(gameOverPlayer);
  }, [gameOverPlayer, stopAlarm]);

  return {
    playCollect,
    playKevinDrop,
    startAlarm,
    stopAlarm,
    playLevelComplete,
    playGameOver,
  };
}

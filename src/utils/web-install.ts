import { Platform } from 'react-native';

export function isWebPlatform(): boolean {
  return Platform.OS === 'web';
}

export function isStandaloneWebApp(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function isMobileWebBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
}

export function shouldShowWebInstallPrompt(): boolean {
  return isWebPlatform() && isMobileWebBrowser() && !isStandaloneWebApp();
}

export const WEB_INSTALL_DISMISS_KEY = 'kevin-web-install-dismissed';

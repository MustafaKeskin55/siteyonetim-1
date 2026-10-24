import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.siteyonetim.resident',
  appName: 'Site Yönetimi',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff',
    },
    Keyboard: {
      resize: 'body',
      style: 'LIGHT',
    },
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.74ea9aacbab1439a988dbba03e878936',
  appName: 'Live Translator',
  webDir: 'dist',
  server: {
    url: 'https://74ea9aac-bab1-439a-988d-bba03e878936.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#e0f2fe',
      showSpinner: false
    }
  }
};

export default config;
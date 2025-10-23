import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartparkr.app',
  appName: 'SmartParkr',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    // For production, point to your deployed domain
    url: 'https://smartparker.space',
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
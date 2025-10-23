import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartparkr.app',
  appName: 'SmartParkr',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    // For production, point to your deployed domain
    url: 'https://smartparker.space'
  }
};

export default config;
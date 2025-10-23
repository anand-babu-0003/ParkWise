import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartparkr.app',
  appName: 'SmartParkr',
  webDir: 'public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
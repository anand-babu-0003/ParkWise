import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartparkr.app',
  appName: 'SmartParkr',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    // For development, you can point to your local server
    // url: 'http://localhost:9002',
    // For production, you would point to your deployed API
    // url: 'https://your-deployed-api.com'
  }
};

export default config;
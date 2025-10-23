# Capacitor App Configuration

## Overview

This document explains the configuration of the Capacitor mobile app for SmartParkr. Proper configuration is essential for the mobile app to communicate with your backend services.

## Configuration Files

### 1. capacitor.config.ts

The main Capacitor configuration file located at the root of the project:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartparkr.app',
  appName: 'SmartParkr',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://smartparker.space', // Production URL
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
```

### 2. Android Manifest (AndroidManifest.xml)

Updated to include network security configuration:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### 3. Network Security Configuration (network_security_config.xml)

Ensures secure connections to your domain:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">smartparker.space</domain>
    </domain-config>
</network-security-config>
```

## Building the Mobile App

### Prerequisites

1. Ensure your Next.js app is deployed to `https://smartparker.space`
2. Make sure your MongoDB Atlas cluster has the proper IP whitelisting
3. Verify that all environment variables are properly configured

### Build Process

1. Export the Next.js app:
   ```bash
   npm run export
   ```

2. Sync Capacitor projects:
   ```bash
   npx cap sync
   ```

3. Open the Android project:
   ```bash
   npx cap open android
   ```

4. Build the APK in Android Studio

## Troubleshooting

### Common Issues

1. **Network Connection Errors**
   - Verify the domain is correctly configured in `network_security_config.xml`
   - Ensure the domain is accessible from mobile networks
   - Check that MongoDB Atlas has the proper IP whitelisting

2. **API Communication Failures**
   - Confirm the `url` in `capacitor.config.ts` points to the correct domain
   - Check that the backend API routes are properly configured
   - Verify SSL certificates are valid

3. **Mixed Content Issues**
   - Ensure `cleartext: false` and `allowMixedContent: false` are set
   - All API calls should use HTTPS

## Security Considerations

1. Never commit sensitive information to version control
2. Use HTTPS for all communications
3. Restrict IP access to MongoDB Atlas
4. Regularly update dependencies
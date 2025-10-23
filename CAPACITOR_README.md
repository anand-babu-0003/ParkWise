# SmartParkr Capacitor Mobile App

This document provides instructions for building and deploying the SmartParkr mobile application using Capacitor.

## Current Status

The Capacitor configuration has been set up with:
- Android platform added
- Web directory configured to use the `public` folder
- Basic placeholder HTML file in the `public` directory

## Building the APK

### Prerequisites
1. Android Studio installed
2. Java JDK 11 or higher
3. Android SDK tools

### Steps to Build

1. **Navigate to the Android project:**
   ```bash
   cd android
   ```

2. **Build the debug APK:**
   ```bash
   # On Windows
   .\gradlew.bat assembleDebug
   
   # On macOS/Linux
   ./gradlew assembleDebug
   ```

3. **Find the APK:**
   Once the build completes, the APK will be located at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Deploying for Full Functionality

For the mobile app to work with full functionality, you need to:

1. **Deploy the Next.js application:**
   - Deploy to Vercel, Netlify, or another hosting service
   - Ensure API routes are accessible

2. **Deploy the MongoDB database:**
   - Use MongoDB Atlas or another cloud MongoDB service

3. **Update Capacitor configuration:**
   - Modify `capacitor.config.ts` to point to your deployed API
   - Uncomment and update the `url` property in the server configuration

4. **Rebuild the mobile app:**
   ```bash
   npx cap sync
   cd android
   .\gradlew.bat assembleDebug
   ```

## Development Workflow

1. **Make changes to your Next.js app**
2. **Export the static files:**
   ```bash
   npm run export
   ```
3. **Sync with Capacitor:**
   ```bash
   npx cap sync
   ```
4. **Build the mobile app:**
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

## Troubleshooting

### Common Issues

1. **Gradle build fails:**
   - Ensure Android Studio is properly installed
   - Check that JAVA_HOME is set correctly
   - Try cleaning the project: `.\gradlew.bat clean`

2. **APK not found:**
   - Verify the build completed successfully
   - Check the `app/build/outputs/apk/debug/` directory

3. **App doesn't connect to API:**
   - Ensure your deployed API is accessible
   - Update the server URL in `capacitor.config.ts`
   - Rebuild and redeploy the mobile app

## Next Steps

1. Deploy your Next.js application to a hosting service
2. Update the Capacitor configuration with your deployed URLs
3. Build and test the mobile app with full functionality
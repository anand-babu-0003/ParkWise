# Deployment Troubleshooting Guide

## Overview

This document provides solutions for common issues encountered when deploying the SmartParkr application to production, particularly on Vercel.

## Common Issues and Solutions

### 1. MongoDB Connection Errors

**Error Message:**
```
{"error":"Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."}
```

**Solutions:**

1. **Whitelist IP Addresses in MongoDB Atlas:**
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add your server's IP address or use `0.0.0.0/0` for testing (not recommended for production)

2. **Verify Connection String:**
   - Check that `MONGO_URI` is properly set in Vercel environment variables
   - Ensure the connection string format is correct:
     ```
     mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
     ```

3. **Test Connection Locally:**
   ```bash
   npm run test:db
   ```

### 2. API Route Issues

**Error Message:**
```
500 Internal Server Error
```

**Solutions:**

1. **Improved Error Handling:**
   - All API routes now have better error handling that returns proper JSON responses
   - Database connection errors are caught and returned with meaningful messages

2. **Check Logs:**
   - Review Vercel logs for detailed error information
   - Look for MongoDB connection errors specifically

### 3. Mobile App Configuration Issues

**Solutions:**

1. **Capacitor Configuration:**
   - Updated `capacitor.config.ts` with proper production URL
   - Added network security configuration for Android

2. **Build Process:**
   ```bash
   npm run export
   npx cap sync
   npx cap open android
   ```

## Testing Your Deployment

### 1. Test Database Connection
```bash
npm run test:db
```

### 2. Test Production Setup
```bash
npm run test:production
```

### 3. Test API Endpoints
```bash
# Test setup status
curl https://smartparker.space/api/setup/status

# Test health check
curl https://smartparker.space/api/health
```

## Environment Variables

Ensure these environment variables are set in your Vercel project:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `NEXT_PUBLIC_BASE_URL` - Should be set to `https://smartparker.space`

## Vercel Deployment Checklist

1. [ ] MongoDB Atlas IP whitelisting configured
2. [ ] Environment variables set in Vercel
3. [ ] Custom domain configured (`smartparker.space`)
4. [ ] SSL certificates properly configured
5. [ ] API routes tested and working
6. [ ] Mobile app configuration updated

## Mobile App Deployment Checklist

1. [ ] `capacitor.config.ts` points to correct production URL
2. [ ] Network security configuration added for Android
3. [ ] App built with `npm run export`
4. [ ] Capacitor synced with `npx cap sync`
5. [ ] APK built and tested

## Troubleshooting Commands

### Test Database Connection
```bash
npm run test:db
```

### Test Production Setup
```bash
npm run test:production
```

### Rebuild and Sync Mobile App
```bash
npm run export
npx cap sync
```

## Common Solutions Summary

1. **For MongoDB Connection Issues:**
   - Whitelist Vercel's IP addresses in MongoDB Atlas
   - Verify `MONGO_URI` environment variable
   - Test connection locally with `npm run test:db`

2. **For API Errors:**
   - Check Vercel logs for detailed error messages
   - Verify all environment variables are set
   - Test API endpoints directly with curl or Postman

3. **For Mobile App Issues:**
   - Ensure `capacitor.config.ts` has correct production URL
   - Verify network security configuration for Android
   - Rebuild and sync with `npm run export && npx cap sync`
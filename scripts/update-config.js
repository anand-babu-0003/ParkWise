#!/usr/bin/env node

/**
 * Script to update configuration values for different deployment scenarios
 * 
 * Usage:
 * node scripts/update-config.js --env production --mongo-uri "mongodb://..." --jwt-secret "secret"
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  config[key] = value;
}

// Read the current config file
const configPath = path.join(__dirname, '..', 'src', 'lib', 'config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');

// Update configuration values based on arguments
if (config['mongo-uri']) {
  configContent = configContent.replace(
    /MONGO_URI: process\.env\.MONGO_URI \|\| '[^']*'/,
    `MONGO_URI: process.env.MONGO_URI || '${config['mongo-uri']}'`
  );
}

if (config['jwt-secret']) {
  configContent = configContent.replace(
    /JWT_SECRET: process\.env\.JWT_SECRET \|\| '[^']*'/,
    `JWT_SECRET: process.env.JWT_SECRET || '${config['jwt-secret']}'`
  );
}

if (config['base-url']) {
  configContent = configContent.replace(
    /NEXT_PUBLIC_BASE_URL: process\.env\.NEXT_PUBLIC_BASE_URL \|\| '[^']*'/,
    `NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || '${config['base-url']}'`
  );
}

if (config['env'] === 'production') {
  configContent = configContent.replace(
    /NODE_ENV: process\.env\.NODE_ENV \|\| 'development'/,
    `NODE_ENV: process.env.NODE_ENV || 'production'`
  );
}

// Write the updated config file
fs.writeFileSync(configPath, configContent);

console.log('Configuration updated successfully!');
console.log('Updated values:');
Object.keys(config).forEach(key => {
  if (key !== 'env') {
    console.log(`  ${key}: ${config[key]}`);
  }
});
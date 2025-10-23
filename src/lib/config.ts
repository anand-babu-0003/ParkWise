// App Configuration
// This file contains all environment variables directly in the app
// for better compatibility with mobile deployments

export const AppConfig = {
  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://babu789387_db_user:676F1gc3Ivb9hwXq@cluster0.64ute6w.mongodb.net/lms-hackathon?retryWrites=true&w=majority&tls=true&tlsInsecure=false&appName=Cluster0',
  
  // Authentication Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'parkwise_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // API Configuration
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Feature Flags
  IS_PRODUCTION: (process.env.NODE_ENV || 'development') === 'production',
};

// Type-safe exports
export const MONGO_URI = AppConfig.MONGO_URI;
export const JWT_SECRET = AppConfig.JWT_SECRET;
export const JWT_EXPIRES_IN = AppConfig.JWT_EXPIRES_IN;
export const NEXT_PUBLIC_BASE_URL = AppConfig.NEXT_PUBLIC_BASE_URL;

export default AppConfig;
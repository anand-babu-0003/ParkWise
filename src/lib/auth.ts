import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { JWT_SECRET, JWT_EXPIRES_IN } from './config';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: AuthTokenPayload): string => {
  // Convert JWT_EXPIRES_IN to the correct type
  const expiresIn = JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
};

export const setAuthCookie = (token: string) => {
  document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const clearAuthCookie = () => {
  document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

export const getCurrentUser = async () => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token);
    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
};
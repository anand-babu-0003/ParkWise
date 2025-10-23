'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface MongoDBProviderProps {
  children: ReactNode;
}

export function MongoDBProvider({ children }: MongoDBProviderProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
// Role-Based Access Control utility

export type Role = 'user' | 'admin' | 'owner';

export const hasRole = (userRole: string | undefined, requiredRole: Role): boolean => {
  if (!userRole) return false;
  
  // Admin has access to everything
  if (userRole === 'admin') return true;
  
  // Owner has access to owner and user features
  if (userRole === 'owner' && (requiredRole === 'owner' || requiredRole === 'user')) return true;
  
  // User only has access to user features
  if (userRole === 'user' && requiredRole === 'user') return true;
  
  return false;
};

export const hasAnyRole = (userRole: string | undefined, requiredRoles: Role[]): boolean => {
  return requiredRoles.some(role => hasRole(userRole, role));
};

// Specific role checks
export const isAdmin = (userRole: string | undefined): boolean => {
  return userRole === 'admin';
};

export const isOwner = (userRole: string | undefined): boolean => {
  return userRole === 'owner' || userRole === 'admin';
};

export const isRegularUser = (userRole: string | undefined): boolean => {
  return userRole === 'user' || userRole === 'admin';
};
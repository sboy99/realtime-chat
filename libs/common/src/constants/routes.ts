const authRoutes = {
  DEFAULT: 'auth',
  REGISTER: 'register',
  LOGIN: 'login',
} as const;

export const Routes = {
  AUTH: authRoutes,
  USER: 'user',
  SESSIOM: 'session',
  CONVERSATION: 'conversation',
} as const;

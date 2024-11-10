export interface User {
  id: string;
  username: string;
  role: 'player' | 'venue_owner';
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}
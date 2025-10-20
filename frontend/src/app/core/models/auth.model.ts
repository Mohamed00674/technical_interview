export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  avatar?: string;
  roles: string[];
}

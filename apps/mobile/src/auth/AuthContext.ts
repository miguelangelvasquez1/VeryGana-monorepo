export interface AuthContextValue {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshAccessToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

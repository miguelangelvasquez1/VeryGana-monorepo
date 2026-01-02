import { AuthContextValue } from "./AuthContext";

export const authRef: {
  current: AuthContextValue | null;
} = {
  current: null,
};

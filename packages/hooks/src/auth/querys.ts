import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@verygana/api';
// import { authStorage } from '@verygana/storage';

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      const response = await loginUser(identifier, password);
    //   await authStorage.setToken(response.token);
      return response;
    },
  });
};

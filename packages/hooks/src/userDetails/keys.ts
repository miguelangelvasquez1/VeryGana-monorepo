export const consumerKeys = {
  all: ['consumer'] as const,

  initialData: () => [...consumerKeys.all, 'initialData'] as const,

  profile: () => [...consumerKeys.all, 'profile'] as const,

  balance: () => [...consumerKeys.all, 'balance'] as const,
};

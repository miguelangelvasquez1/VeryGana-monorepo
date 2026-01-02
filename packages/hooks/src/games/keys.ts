export const gameKeys = {
  all: ['games'] as const,

  lists: () => [...gameKeys.all, 'list'] as const,
  list: (page: number, size: number) =>
    [...gameKeys.lists(), { page, size }] as const,

  sessions: () => [...gameKeys.all, 'session'] as const,
  session: (sessionId: string) =>
    [...gameKeys.sessions(), sessionId] as const,
};

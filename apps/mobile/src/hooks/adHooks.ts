import { createAdHooks } from '@verygana/hooks';
import { adService } from '../services/adService';

export const { useActiveAds } = createAdHooks(adService);

// Ej: Para más hooks:
// export const { useActiveAds, useAdById, useAdStats } = createAdHooks(adService);
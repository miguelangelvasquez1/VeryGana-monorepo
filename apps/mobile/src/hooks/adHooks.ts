import { createAdHooks } from '@verygana/hooks';
import { adService } from '../services/adService';

export const {
    useActiveAds, 
    useNextAd, 
    useLikeAd,
} = createAdHooks(adService);
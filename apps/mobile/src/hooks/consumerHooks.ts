import { createConsumerHooks } from '@verygana/hooks';
import { consumerService } from '../services/consumerService';

export const {
    useConsumerInitialData,
    useConsumerProfile,
    useUserBalance,
} = createConsumerHooks(consumerService);
import { createConsumerService } from "@verygana/api";
import { apiClient } from "../api/apiClient";

export const consumerService = createConsumerService(apiClient);
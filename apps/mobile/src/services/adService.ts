import { createAdService } from "@verygana/api";
import { apiClient } from "../api/apiClient";

export const adService = createAdService(apiClient);

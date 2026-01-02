import { createGameService } from "@verygana/api";
import { apiClient } from "../api/apiClient";

export const gameService = createGameService(apiClient);
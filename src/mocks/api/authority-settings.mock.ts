import { http } from "msw";

import { authoritySettingsMockData } from "@/mocks/data/authority-settings.data";
import { createApiResponse } from "@/mocks/utils";

export const authoritySettingsHandlers = [
  http.get("/api/cfg/settings", () =>
    createApiResponse({ data: authoritySettingsMockData }),
  ),
];

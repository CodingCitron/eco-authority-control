import { authorityAuthHandlers } from "./api/authority-auth.mock";
import { authoritySearchHandlers } from "./api/authority-search.mock";
import { authoritySettingsHandlers } from "./api/authority-settings.mock";

export const handlers = [
  ...authorityAuthHandlers,
  ...authoritySearchHandlers,
  ...authoritySettingsHandlers,
];

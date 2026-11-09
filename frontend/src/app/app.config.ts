import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// Public query navigation is owned by CauseService so static-host refreshes and
// native back/forward restore the same screen without an unused competing router.
export const appConfig: ApplicationConfig = { providers: [provideBrowserGlobalErrorListeners()] };

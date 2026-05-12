import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    /* withComponentInputBinding() permet que els parametres de la ruta arribin als components
     directament via InputSignal, sense haver de subscriure'm a ActivatedRoute.paramMap */
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay())
  ]
};

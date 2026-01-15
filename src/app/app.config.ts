import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from "primeng/config";

import Aura from '@primeuix/themes/aura';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptorFn} from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: false,
          // darkModeSelector: ""
        }
      }
    })
  ]
};

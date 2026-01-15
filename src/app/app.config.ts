import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { providePrimeNG } from "primeng/config";
import Aura from '@primeuix/themes/aura';
import { authInterceptorFn } from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    provideTranslateService({
      defaultLanguage: 'ka'
    }),
    provideTranslateHttpLoader({
      prefix: './i18n/',
      suffix: '.json'
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: false,
          darkModeSelector: '.dark-mode'
        }
      }
    })
  ]
};

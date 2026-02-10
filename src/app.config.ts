import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { provideAbpCore, withOptions } from '@abp/ng.core';
import { environment } from './environments/environment.prod';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { registerLocale } from './app/shared/locales/vi.locale';
import { TokenInterceptor } from '@/shared/interceptors/token.interceptor';
import { GlobalHttpInterceptorService } from '@/shared/interceptors/error-handler.interceptor';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
registerLocaleData(localeVi);
export const appConfig: ApplicationConfig = {
    providers: [
        provideAbpCore(
            withOptions({
                environment,
                registerLocaleFn: registerLocale
            }),
        ),
        provideAbpOAuth(),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true },
        { provide: LOCALE_ID, useValue: 'vi' },
        DialogService,
        MessageService,
        NotificationService,
        UtilityService,
        ConfirmationService,
    ]
};

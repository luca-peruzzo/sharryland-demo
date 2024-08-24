import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { HttpLoaderFactory } from './app/app.module';
import { environment } from './environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { BeerService } from './app/services/beer.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { HttpRequestInterceptorService } from './app/services/http-request-interceptor.service';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, BrowserModule, HammerModule, bootstrapApplication } from '@angular/platform-browser';
import { LoadingService } from './app/services/loading.service';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, MatProgressSpinnerModule, HammerModule, TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })),
        { provide: APP_BASE_HREF, useValue: '/' }, BeerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptorService,
            multi: true
        },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerGestureConfig
        },
        LoadingService, provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));

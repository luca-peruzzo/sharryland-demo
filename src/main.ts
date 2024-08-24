import { APP_BASE_HREF } from '@angular/common';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
    BrowserModule,
    HAMMER_GESTURE_CONFIG,
    HammerGestureConfig,
    HammerModule,
    bootstrapApplication,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app/app.component';
import { HttpLoaderFactory } from './app/app.module';
import { AppRoutingModule, routes } from './app/app.routes';
import { BeerService } from './app/services/beer.service';
import { HttpRequestInterceptorService } from './app/services/http-request-interceptor.service';
import { LoadingService } from './app/services/loading.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      MatProgressSpinnerModule,
      HammerModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    { provide: APP_BASE_HREF, useValue: '/' },
    BeerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptorService,
      multi: true,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig,
    },
    LoadingService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));

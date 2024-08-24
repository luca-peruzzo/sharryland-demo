import { APP_BASE_HREF } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { BeerService } from './app/services/beer.service';
import { HttpRequestInterceptorService } from './app/services/http-request-interceptor.service';
import { LoadingService } from './app/services/loading.service';
import { environment } from './environments/environment';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from '@angular/fire/analytics';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
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
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'sharryland-demo',
        appId: '1:1043007290103:web:926d89709fce5f4600b1f2',
        storageBucket: 'sharryland-demo.appspot.com',
        apiKey: 'AIzaSyCXfsen7Q97JwqC6nLRV_sSFxE-36qayXA',
        authDomain: 'sharryland-demo.firebaseapp.com',
        messagingSenderId: '1043007290103',
        measurementId: 'G-40DTBB67QL',
      })
    ),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
  ],
}).catch((err) => console.error(err));

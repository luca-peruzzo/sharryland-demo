import 'hammer-timejs';
import 'hammerjs';

import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { HomeComponent } from './pages/home/home.component';
import { ShowComponent } from './pages/show/show.component';
import { BeerService } from './services/beer.service';
import { HttpRequestInterceptorService } from './services/http-request-interceptor.service';
import { LoadingService } from './services/loading.service';
import { BeerWidgetComponent } from './widget/beer-widget/beer-widget.component';
import { PaginatorComponent } from './widget/paginator/paginator.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShowComponent,
    FavouritesComponent,
    BeerWidgetComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    HammerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }, BeerService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptorService,
    multi: true
  },
  {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerGestureConfig
  },
    LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
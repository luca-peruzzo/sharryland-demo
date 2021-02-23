import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ShowComponent } from './pages/show/show.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { BeerService } from './services/beer.service';
import { BeerWidgetComponent } from './widget/beer-widget/beer-widget.component';
import { PaginatorComponent } from './widget/paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpRequestInterceptorService } from './services/http-request-interceptor.service';
import { LoadingService } from './services/loading.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'hammerjs';
import 'hammer-timejs';

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
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }, BeerService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptorService,
    multi: true
  }, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }

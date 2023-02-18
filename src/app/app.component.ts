import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, Observable } from 'rxjs';
import { BeerService } from './services/beer.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'sharryland-demo';
  loading = false;
  location$: Observable<string>;
  constructor(
    public loadingService: LoadingService,
    private router: Router,
    private beerService: BeerService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.location$ = this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      map(e => (e as NavigationStart).url)
    )
  }

  goToShow(): void {
    this.beerService.getRandomBeer().subscribe(
      response => {
        if (!!response && !!response[0]) {
          this.beerService.setPayload(response[0].id, response);
          this.router.navigate(['/show']);
        }
      }
    );
  }
}

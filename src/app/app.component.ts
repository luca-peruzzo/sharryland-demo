import { Location } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs/operators';
import { Beer } from 'src/assets/om/beer';
import { BeerService } from './services/beer.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'sharryland-demo';
  loading = false;
  location!: string;
  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private beerService: BeerService,
    translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.listenToLoading();
    this.router.events.subscribe(ev => {
      if (!!(ev as NavigationStart).url) {
        this.location = (ev as NavigationStart).url;
      }
    });
  }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();

  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
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
  goToFavourites(): void {
    this.router.navigate(['/favourites']);
  }
}

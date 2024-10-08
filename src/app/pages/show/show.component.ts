import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeerService } from 'src/app/services/beer.service';
import { Beer } from 'src/assets/om/beer';
import { NgClass, NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.scss'],
    standalone: true,
    imports: [NgClass, NgStyle, TranslateModule]
})
export class ShowComponent implements OnInit {
  private router = inject(Router);
  private beerService = inject(BeerService);

  isMobile = false;
  currentIndex: number = 0;
  beerList: Beer[] = [];
  currentId = 0;
  currentBeer!: Beer;
  url = 'url("../../../assets/img/cerchio.png") no-repeat right';
  direction = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
  }
  ngOnInit(): void {
    if (!!this.beerService.getPayload()) {
      this.beerList = this.beerService.getPayload().beerList;
      this.currentId = this.beerService.getPayload().currentId;
      const currentBeer = this.beerList.find(beer => beer.id === this.currentId);
      const currentIndex = this.beerList.findIndex(beer => beer.id === this.currentId);
      if (!!currentBeer) {
        this.currentBeer = currentBeer;
        this.currentIndex = currentIndex;
        this.url = this.url + ', url(' + currentBeer.image_url + ')';
      }
    } else {
      this.router.navigate(['/home']);
    }
    this.beerService.payloadListener.subscribe(() => {
      this.beerList = this.beerService.getPayload().beerList;
      this.currentId = this.beerService.getPayload().currentId;
      const currentBeer = this.beerList.find(beer => beer.id === this.currentId);
      const currentIndex = this.beerList.findIndex(beer => beer.id === this.currentId);
      if (!!currentBeer) {
        this.currentBeer = currentBeer;
        this.currentIndex = currentIndex;
        this.url = this.url + ', url(' + currentBeer.image_url + ')';
      }
    });
  }
  changeFavouritesStatus(): void {
    this.currentBeer.isFavourite = !this.currentBeer.isFavourite;
    this.beerService.setFavourites(this.currentBeer);
  }
  onPan(ev: any, left?: boolean) {
    ev.preventDefault();
    console.log(this.direction);
    if (left && !!this.beerList[this.currentIndex + 1]) {
      this.rightArrow();
    } else if (!left && !!this.beerList[this.currentIndex - 1]) {
      this.leftArrow();
    }
  }
  rightArrow() {
    this.currentBeer = this.beerList[this.currentIndex + 1];
    this.currentIndex = this.currentIndex + 1;
    this.url = this.url + ', url(' + this.currentBeer.image_url + ')';
  }
  leftArrow() {
    this.currentBeer = this.beerList[this.currentIndex - 1];
    this.currentIndex = this.currentIndex - 1;
    this.url = this.url + ', url(' + this.currentBeer.image_url + ')';
  }
}

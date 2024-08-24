import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BeerService } from 'src/app/services/beer.service';
import { Beer } from 'src/assets/om/beer';

import { PaginatorComponent } from '../../widget/paginator/paginator.component';
import { BeerWidgetComponent } from '../../widget/beer-widget/beer-widget.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    templateUrl: './favourites.component.html',
    styleUrls: ['./favourites.component.scss'],
    standalone: true,
    imports: [PaginatorComponent, BeerWidgetComponent, TranslateModule]
})
export class FavouritesComponent implements OnInit {
  private beerService = inject(BeerService);
  private router = inject(Router);

  totalBeersNumber = 0;
  lastIndex = 0;
  beerMap: Map<number, Beer[]> = new Map<number, Beer[]>([[1, []]]);
  currentPageNumber = 1;
  direction = '';
  isMobile = false;
  totalBeersPerPage = 10;
  pageDirection = '';

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
    if (this.isMobile) {
      this.totalBeersPerPage = 5;
    }
    const beerList: Beer[] = this.beerService.getFavourites();
    if (beerList.length !== 0) {
      this.totalBeersNumber = beerList.length;
      this.lastIndex = Math.floor(this.totalBeersNumber / this.totalBeersPerPage) + ((this.totalBeersNumber % this.totalBeersPerPage === 0) ? 0 : 1);
      for (let i = 0; i < this.lastIndex; i++) {
        if (i === this.lastIndex - 1) {
          this.beerMap.set(i + 1, beerList.slice(i * this.totalBeersPerPage, beerList.length));
        } else {
          this.beerMap.set(i + 1, beerList.slice(i * this.totalBeersPerPage, (i * this.totalBeersPerPage) + this.totalBeersPerPage));
        }
      }
    }
  }

  switchPage(pageNumber: number): void {
    this.currentPageNumber = pageNumber;
  }
  goToShow(id: number): void {
    // go to show
    const beerList: Beer[] = [];
    for (let i = 1; i <= this.lastIndex; i++) {
      beerList.push(...(this.beerMap.get(i) || []));
    }
    this.beerService.setPayload(id, beerList);
    this.router.navigate(['/show']);
  }
  editFavList(id: number): void {
    const beerList: Beer[] = [];
    this.beerMap.forEach(v => {
      beerList.push(...v);
    });
    if (!!beerList.find(b => b.id === id)) {
      beerList.splice(beerList.map(br => br.id).indexOf(id), 1);
    }
    this.beerMap.clear();
    this.totalBeersNumber = beerList.length;
    this.lastIndex = Math.floor(this.totalBeersNumber / this.totalBeersPerPage) + ((this.totalBeersNumber % this.totalBeersPerPage === 0) ? 0 : 1);
    for (let i = 0; i < this.lastIndex; i++) {
      if (i === this.lastIndex - 1) {
        this.beerMap.set(i + 1, beerList.slice(i * this.totalBeersPerPage, beerList.length));
      } else {
        this.beerMap.set(i + 1, beerList.slice(i * this.totalBeersPerPage, (i * this.totalBeersPerPage) + this.totalBeersPerPage));
      }
    }
  }
}

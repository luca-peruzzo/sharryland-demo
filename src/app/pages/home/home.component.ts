import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BeerService } from 'src/app/services/beer.service';
import { Beer } from 'src/assets/om/beer';
import { FormModel } from 'src/assets/om/formModel';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { PaginatorComponent } from '../../widget/paginator/paginator.component';
import { BeerWidgetComponent } from '../../widget/beer-widget/beer-widget.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [FormsModule, NgClass, NgIf, PaginatorComponent, NgFor, BeerWidgetComponent, TranslateModule]
})
export class HomeComponent implements OnInit, AfterViewInit {
  totalBeersNumber = 0;
  lastIndex = 0;
  beerMap: Map<number, Beer[]> = new Map<number, Beer[]>([[1, []]]);
  isAdvSearch = false;
  currentPageNumber = 1;
  model: FormModel = new FormModel('', '', '');
  onlyNumbers: RegExp = /^\d/;

  @ViewChild('advancedSearch')
  advSearchForm!: NgForm;
  timeout = 0;
  direction = '';
  isMobile = false;

  totalBeersPerPage = 10;
  pageDirection = '';
  startX: any;
  startY: any;
  constructor(private beerService: BeerService, private router: Router) {
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
    this.getAllBeers(this.currentPageNumber, this.totalBeersPerPage);
  }
  ngAfterViewInit(): void {
    if (!!this.advSearchForm) {
      this.advSearchForm.valueChanges?.subscribe((res: FormModel) => {
        clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
          this.trySubmit();
        }, 500);
      });
    }
  }

  switchPage(pageNumber: number): void {
    if (this.isAdvSearch) {
      this.advSearch(pageNumber);
    } else {
      this.getAllBeers(pageNumber, this.totalBeersPerPage);
    }
  }
  trySubmit(): void {
    if (!!this.advSearchForm && this.advSearchForm.form.valid) {
      if (((this.model.nameOrFood || '') !== '' || (this.model.abvGt || '') !== '' || (this.model.abvLt || '') !== '')) {
        this.advSearchForm.ngSubmit.emit();
      } else {
        this.beerMap = new Map<number, Beer[]>([]);
        this.getAllBeers(1, this.totalBeersPerPage);
      }
    }
  }
  onSubmit(): void {
    this.advSearch(1);
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
  getAllBeers(pageNumber: number, perPage: number): void {
    this.currentPageNumber = pageNumber;
    if ((this.beerMap.get(pageNumber) || []).length === 0) {
      this.beerService.getAllBeers(pageNumber, perPage).subscribe(
        response => {
          if (!!response) {
            this.beerService.getFavourites().forEach(fav => {
              response.forEach((res, i) => {
                if (fav.id === res.id) {
                  response[i].isFavourite = true;
                }
              })
            })
            this.beerMap.set(pageNumber, response);
            this.totalBeersNumber = 325;
            /*
             * service dosesn't retrieve the total amount of object in db, so I get it empirically
             * --> NOT A GOOD METHOD BUT THE ONLY AVAILABLE for pagination
             */
            this.lastIndex = Math.floor(this.totalBeersNumber / this.totalBeersPerPage) + ((this.totalBeersNumber % this.totalBeersPerPage === 0) ? 0 : 1);
          }
        }
      );
    }
  }
  advSearch(pageNumber: number): void {
    this.currentPageNumber = pageNumber;
    // request limit per page = 80, I suppose max 80 results for search
    this.beerService.searchBeer(pageNumber,
      {
        nameOrFood: this.model.nameOrFood,
        abv_gt: this.model.abvGt,
        abv_lt: this.model.abvLt
      })
      .subscribe(
        response => {
          if (!!response) {
            this.totalBeersNumber = response.length;
            this.lastIndex = Math.floor(this.totalBeersNumber / this.totalBeersPerPage) + ((this.totalBeersNumber % this.totalBeersPerPage === 0) ? 0 : 1);
            this.beerMap = new Map<number, Beer[]>([]);
            for (let i = 0; i < this.lastIndex; i++) {
              if (i === this.lastIndex - 1) {
                this.beerMap.set(i + 1, response.slice(i * this.totalBeersPerPage, response.length));
              } else {
                this.beerMap.set(i + 1, response.slice(i * this.totalBeersPerPage, (i * this.totalBeersPerPage) + (this.totalBeersPerPage)));
              }
            }
          }
        }
      );
  }
}

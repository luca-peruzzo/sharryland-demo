import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { BeerService } from 'src/app/services/beer.service';
import { Beer } from 'src/assets/om/beer';
import { NgClass } from '@angular/common';

@Component({
    selector: 'beer-widget',
    templateUrl: './beer-widget.component.html',
    styleUrls: ['./beer-widget.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class BeerWidgetComponent implements OnInit {
  private beerService = inject(BeerService);


  @Input()
  beer!: Beer;
  @Input() isSelected = false;
  @Input() direction = '';
  @Output() isClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() favouriteStatusChange: EventEmitter<number> = new EventEmitter<number>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() { }

  ngOnInit(): void {
  }
  changeFavouritesStatus(): void {
    this.beer.isFavourite = !this.beer.isFavourite;
    this.beerService.setFavourites(this.beer);
    if (!this.beer.isFavourite) {
      this.favouriteStatusChange.emit(this.beer.id);
    }
  }
}

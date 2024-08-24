import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'beer-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class PaginatorComponent implements OnChanges {

  @Input() lastIndex = 0;
  @Input() pagePerRow = 3;
  @Output() selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() prevClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() nextClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() pageDirection: EventEmitter<string> = new EventEmitter<string>();
  firstPageVisibleIndex = 0;
  selectedIndex = 0;
  pages: number[] = [1];
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lastIndex) {
      this.pages = [];
      this.selectedIndex = 0;
      this.firstPageVisibleIndex = 0;
      for (let i = 0; i < this.lastIndex; i++) {
        this.pages.push(i);
      }
    }
  }
  prev(): void {
    if (this.firstPageVisibleIndex >= this.pagePerRow) {
      this.firstPageVisibleIndex = this.firstPageVisibleIndex - this.pagePerRow;
      this.selectedIndex = this.firstPageVisibleIndex + this.pagePerRow - 1;
      this.selectedIndexChange.emit(this.selectedIndex + 1);
      this.prevClicked.emit();
      this.pageDirection.emit('left');
    }
  }
  next(): void {
    if (this.lastIndex - this.firstPageVisibleIndex > this.pagePerRow) {
      this.firstPageVisibleIndex = this.firstPageVisibleIndex + this.pagePerRow;
      this.selectedIndex = this.firstPageVisibleIndex;
      this.selectedIndexChange.emit(this.selectedIndex + 1);
      this.nextClicked.emit();
      this.pageDirection.emit('right');
    }
  }
  select(index: number): void {
    const direction = this.selectedIndex < index ? 'right' : 'left';
    this.selectedIndex = index;
    this.selectedIndexChange.emit(this.selectedIndex + 1);
    this.pageDirection.emit(direction);
  }
  panSelect(index: number, direction: string): void {
    if (direction == 'swipeleft') {
      if ((this.selectedIndex + 1) % this.pagePerRow == 0) {
        this.next();
      } else {
        this.select(index + 1);
      }
    }
    if (direction == 'swiperight') {
      if ((this.selectedIndex + 1) % this.pagePerRow == 1) {
        this.prev();
      } else {
        this.select(index - 1);
      }
    }
  }
}

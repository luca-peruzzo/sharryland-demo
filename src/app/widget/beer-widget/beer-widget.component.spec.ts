import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerWidgetComponent } from './beer-widget.component';

describe('BeerWidgetComponent', () => {
  let component: BeerWidgetComponent;
  let fixture: ComponentFixture<BeerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeerWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { BeerService } from './beer.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BeerService', () => {
  let service: BeerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BeerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

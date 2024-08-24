import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Beer } from 'src/assets/om/beer';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  private http = inject(HttpClient);

  url = 'https://api.punkapi.com/v2/beers';
  private payload!: { currentId: number, beerList: Beer[] };
  payloadListener: Subject<void> = new Subject<void>();
  private favourites: Beer[] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() { }

  getAllBeers(page: number, perPage:number): Observable<Beer[]> {
    const params = new HttpParams().set('page', page.toString()).set('per_page', perPage.toString());

    return this.http.get<Beer[]>(this.url, { responseType: 'json', params }).pipe(
      catchError(this.handleError<Beer[]>('getAllBeers', []))
    );
  }
  getBeer(id: number): Observable<Beer[]> {
    const params = new HttpParams().set('ids', id.toString());
    return this.http.get<Beer[]>(this.url, { responseType: 'json', params }).pipe(
      catchError(this.handleError<Beer[]>('getBeer', []))
    );
  }
  getRandomBeer(): Observable<Beer[]> {
    return this.http.get<Beer[]>(this.url.concat('/random'), { responseType: 'json' }).pipe(
      catchError(this.handleError<Beer[]>('getRandomBeer', []))
    );
  }
  searchBeer(page: number, search: Partial<{ nameOrFood: string, abv_gt: string, abv_lt: string }>): Observable<Beer[]> {
    if (!!search) {
      let firstParams = new HttpParams().set('page', page.toString()).set('per_page', '80');

      if (!!search.nameOrFood && search.nameOrFood !== '') {
        firstParams = firstParams.append('beer_name', search.nameOrFood.replace(/\s+/, '_'));
      }
      if (!!search.abv_gt && search.abv_gt !== '') {
        firstParams = firstParams.append('abv_gt', search.abv_gt.replace(/\s+/, '_'));
      }
      if (!!search.abv_lt && search.abv_lt !== '') {
        firstParams = firstParams.append('abv_lt', search.abv_lt.replace(/\s+/, '_'));
      }

      const firstObservable = this.http.get<Beer[]>(this.url, { responseType: 'json', params: firstParams });

      let secondParams = new HttpParams();

      if (!!search.nameOrFood && search.nameOrFood !== '') {
        secondParams = secondParams.append('food', search.nameOrFood.replace(/\s+/, '_'));
      }
      if (!!search.abv_gt && search.abv_gt !== '') {
        secondParams = secondParams.append('abv_gt', search.abv_gt.replace(/\s+/, '_'));
      }
      if (!!search.abv_lt && search.abv_lt !== '') {
        secondParams = secondParams.append('abv_lt', search.abv_lt.replace(/\s+/, '_'));
      }

      const secondObservable = this.http.get<Beer[]>(this.url, { responseType: 'json', params: secondParams });

      return forkJoin([firstObservable, secondObservable]).pipe<Beer[]>(
        map((result: Beer[][]) => {
          const concatArray = result[0].concat(result[1]);
          return concatArray.filter((item, index) => {
            return (concatArray.map(o => o.id).indexOf(item.id) === index);
          });
        })
      ).pipe(
        catchError(this.handleError<Beer[]>('searchBeer', []))
      );
    } else {
      return of<Beer[]>([]);
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getPayload(): { currentId: number, beerList: Beer[] } {
    return this.payload;
  }
  setPayload(id: number, beerList: Beer[]): void {
    this.payload = { currentId: id, beerList };
    this.payloadListener.next();
  }

  getFavourites(): Beer[] {
    return this.favourites;
  }
  setFavourites(beer: Beer): void {
    const favList: Beer[] = [...this.favourites];
    if (favList.map(b => b.id).indexOf(beer.id) === -1) {
      favList.push(beer);
    } else {
      favList.splice(favList.map(b => b.id).indexOf(beer.id), 1);
    }
    this.favourites = [...favList];
  }
}

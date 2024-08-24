import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class HttpRequestInterceptorService implements HttpInterceptor {

  constructor(
    private loading: LoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loading.setLoading(true, request.url);
    return next.handle(request)
      .pipe<any>(catchError((err) => {
        this.loading.setLoading(false, request.url);
        return err;
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loading.setLoading(false, request.url);
        }
        return evt;
      }));
  }
}

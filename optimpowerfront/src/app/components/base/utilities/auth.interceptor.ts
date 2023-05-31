import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
constructor(private loadingService : LoadingService) {}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true);
    return next.handle(req)
        .pipe(catchError((err: HttpErrorResponse)=>{
            this.loadingService.setLoading(false);
        return throwError(() => err);
        }),
        map((res: any) => {
            if(res?.body){
                this.loadingService.setLoading(false);
                return res;
            }
          }));

}

}

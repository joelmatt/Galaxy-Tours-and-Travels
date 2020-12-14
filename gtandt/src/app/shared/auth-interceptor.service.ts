import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        if(!req.params.get('funcName')){
            return next.handle(req);
        }
        else{
            return this.authService.user.pipe(
                take(1),
                exhaustMap(user => {
                    const modifiedReq = req.clone({headers: req.headers.append('X-Amz-Security-Token', user.getIdToken)});
                    return next.handle(modifiedReq);
                })
            );
        }
    }
}
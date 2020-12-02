import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AppConstants } from './imp-data';


// This class intercepts all the http requests and adds the header that contains all the api keys
export class InterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler){
        console.log("Request on the way");
        const modifiedRequest = req.clone({
            headers: req.headers.append('x-api-key',AppConstants._API_END_KEY)
        });
        return next.handle(modifiedRequest);
    }
}
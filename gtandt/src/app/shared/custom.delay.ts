import { Observable, of, throwError } from 'rxjs';
import {delay, mergeMap, retryWhen } from 'rxjs/operators';

const DEFAULT_MAX_RETRIES = 3; // default amount of retries
const errorMessage = () => `Couldn't connect with the server. wait for sometime and try again`

export function retryAfterDelay(delayMs: number, maxRetries = DEFAULT_MAX_RETRIES){
    let retries = maxRetries;
    return (src: Observable<any>) => 
    src.pipe(
        retryWhen((errors: Observable<any>)=>errors.pipe(
            delay(delayMs),
            mergeMap(error => --retries > 0 ? of(error) : throwError(errorMessage())
        )))
    );
}
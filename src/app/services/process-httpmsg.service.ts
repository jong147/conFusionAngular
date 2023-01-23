import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }

  // function to handle errors
  public handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errMsg = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
    }
    return throwError(() => errMsg);
  }
  
}

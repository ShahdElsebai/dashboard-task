import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './../../auth/services/auth.service';
import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

// you should manually use the below so that skip attaching the token
// check the login request to see how to add it
export const SKIP_TOKEN_INTERCEPTOR = new HttpContextToken(() => false); // default state for skipping interceptor

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let copiedRequest = request.clone();
    const token = this.authService.getAuthToken();

    // attach the token if there's a token and to requets except requests which choose to skip the token
    if (token && !copiedRequest.context.get(SKIP_TOKEN_INTERCEPTOR)) {
      // If we have a token, we set it to the header
      copiedRequest = copiedRequest.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(copiedRequest);
  }
}

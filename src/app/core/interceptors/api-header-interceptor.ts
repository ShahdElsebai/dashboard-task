import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
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
export class ApiHeaderInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAuthToken();

    // Define headers that should be included in every request
    let headersConfig: { [key: string]: string } = {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
      'App-Version': '11',
      'Device-Name': 'chrome',
      'Device-OS-Version': '13',
      'Device-UDID': '1234',
      'Device-Push-Token': '123456',
      'Device-Type': 'web',
    };

    // Only add the Authorization header if the token exists and SKIP_TOKEN_INTERCEPTOR is not set
    if (token && !request.context.get(SKIP_TOKEN_INTERCEPTOR)) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    // Clone the request with the updated headers
    const copiedRequest = request.clone({
      setHeaders: headersConfig,
    });

    return next.handle(copiedRequest);
  }
}

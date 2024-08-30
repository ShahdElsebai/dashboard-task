import { BehaviorSubject, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  AuthenticationStatus,
  LoginRequest,
  LoginResponse,
} from '../models/auth.model';
import { LocalStorageKeys } from 'src/app/core/models/core.model';
import { DataLocalStorageService } from 'src/app/core/services/data-local-storage.service';
import { URLS } from 'src/app/core/apis/api-urls';
import { SKIP_TOKEN_INTERCEPTOR } from 'src/app/core/interceptors/api-header-interceptor';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticatedSubject = new BehaviorSubject<AuthenticationStatus>(
    AuthenticationStatus.UNAUTHENTICATED
  );
  constructor(
    private httpClient: HttpClient,
    private dataLocalStorageService: DataLocalStorageService
  ) {
    this.setAuthenticationStatus();
  }
  getAuthToken() {
    return this.dataLocalStorageService.getItemFromLocalStorage(
      LocalStorageKeys.TOKEN
    );
  }
  setAuthToken(token: string) {
    return this.dataLocalStorageService.setItemInLocalStorage(
      LocalStorageKeys.TOKEN,
      token
    );
  }
  setAuthenticationStatus(): void {
    const isAuthenticated =
      this.getAuthToken() !== null
        ? AuthenticationStatus.AUTHENTICATED
        : AuthenticationStatus.UNAUTHENTICATED;
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
  isAuthenticated(): boolean {
    return (
      this.isAuthenticatedSubject.value === AuthenticationStatus.AUTHENTICATED
    );
  }
  login(body: LoginRequest): Observable<LoginResponse> {
    this.isAuthenticatedSubject.next(AuthenticationStatus.AUTHENTICATED);
    return this.httpClient
      .post<LoginResponse>(environment.BASE_URL + URLS.auth.login, body, {
        context: new HttpContext().set(SKIP_TOKEN_INTERCEPTOR, true),
      })
      .pipe(
        map((response: LoginResponse) => {
          const authToken = response.data.token;
          this.setAuthToken(authToken);
          return response;
        })
      );
  }
}

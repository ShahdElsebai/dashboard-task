import { Injectable } from '@angular/core';
import { URLS } from 'src/app/core/apis/api-urls';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ResponseAPI } from 'src/app/shared/model/shared.model';
import { LocalStorageKeys } from 'src/app/core/models/core.model';
import { DataLocalStorageService } from 'src/app/core/services/data-local-storage.service';
import { SKIP_TOKEN_INTERCEPTOR } from 'src/app/core/interceptors/api-header-interceptor';

import {
  AuthenticationStatus,
  LogedInUser,
  LoginRequest,
} from '../models/auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticatedSubject = new BehaviorSubject<AuthenticationStatus>(
    AuthenticationStatus.UNAUTHENTICATED
  );
  constructor(
    private _http: HttpClient,
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
  login(body: LoginRequest): Observable<ResponseAPI<LogedInUser>> {
    this.isAuthenticatedSubject.next(AuthenticationStatus.AUTHENTICATED);
    return this._http
      .post<ResponseAPI<LogedInUser>>(
        environment.BASE_URL + URLS.auth.login,
        body,
        {
          context: new HttpContext().set(SKIP_TOKEN_INTERCEPTOR, true),
        }
      )
      .pipe(
        map((response: ResponseAPI<LogedInUser>) => {
          const authToken = response.data.token;
          this.setAuthToken(authToken);
          return response;
        })
      );
  }
}

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationStatus } from '../models/auth.model';
import { LocalStorageKeys } from 'src/app/core/models/core.model';
import { DataLocalStorageService } from 'src/app/core/services/data-local-storage.service';

@Injectable({
  providedIn: 'root'
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
  private setAuthenticationStatus(): void {
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

}

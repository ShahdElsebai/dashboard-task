import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URLS } from 'src/app/core/apis/api-urls';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ResponseAPI } from 'src/app/shared/model/shared.model';
import { CreateOrUpdateUserRequest, User } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _http: HttpClient) {}
  getAllUsers(
    pageNumber = 0,
    filters: {
      gender?: string;
      type?: string;
      is_permium?: number;
    } = {}
  ): Observable<ResponseAPI<User[]>> {
    let queryParams = new HttpParams().set('page', pageNumber);
    let return_all = true;
    if (filters.gender) {
      queryParams = queryParams.append('gender', filters.gender);
      return_all = false;
    }
    if (filters.type) {
      queryParams = queryParams.append('type', filters.type);
      return_all = false;
    }
    if (filters.is_permium) {
      queryParams = queryParams.append('is_premium', filters.is_permium);
      return_all = false;
    }
    if (return_all) queryParams = queryParams.append('return_all', 1);
    return this._http.get<ResponseAPI<User[]>>(
      environment.BASE_URL + URLS.user.getAll,
      {
        params: queryParams,
      }
    );
  }
  createUser(createdUser: CreateOrUpdateUserRequest): Observable<any> {
    return this._http.post<any>(environment.BASE_URL + URLS.user.create, {
      ...createdUser,
    });
  }
  updateUser(
    updatedUser: CreateOrUpdateUserRequest,
    userId: number
  ): Observable<any> {
    return this._http.post<any>(
      environment.BASE_URL + URLS.user.getAll +`/${userId}/edit`,
      {
        ...updatedUser,
      }
    );
  }
  deleteUser(
    userId: number
  ): Observable<any> {
    return this._http.post<any>(
      environment.BASE_URL + URLS.user.getAll +`/${userId}/delete`,{}
      
    );
  }
  toggleUserActivation(
    userId: number
  ): Observable<any> {
    return this._http.post<any>(
      environment.BASE_URL + URLS.user.getAll +`/${userId}/activation`,{}
      
    );
  }
}

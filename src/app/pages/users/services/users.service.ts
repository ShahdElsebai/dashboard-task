import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { URLS } from 'src/app/core/apis/api-urls';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ResponseAPI } from 'src/app/shared/model/shared.model';

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
      is_permium?: boolean;
    } = {}
  ): Observable<ResponseAPI<User[]>> {
    let queryParams = new HttpParams().set('page', pageNumber);
    let return_all = true;
    if (filters.gender) {
      queryParams = queryParams.append('gender', filters.gender);
      return_all = false;
    }
    if (filters.type) {
      queryParams = queryParams.append('jobId', filters.type);
      return_all = false;
    }
    if (filters.is_permium) {
      queryParams = queryParams.append('workPlaceId', filters.is_permium);
      return_all = false;
    }
    if(return_all)
      queryParams = queryParams.append('return_all', 1);
    return this._http.get<ResponseAPI<User[]>>(
      environment.BASE_URL + URLS.user.getAll,
      {
        params: queryParams,
      }
    );
  }
}

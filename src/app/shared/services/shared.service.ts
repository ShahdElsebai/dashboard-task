import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLS } from 'src/app/core/apis/api-urls';
import { environment } from 'src/app/environments/environment';
import { Country, PaginatedResponse } from '../model/shared.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private _http: HttpClient) {}

  getAllCountries(): Observable<PaginatedResponse<Country[]>> {
    return this._http.get<PaginatedResponse<Country[]>>(
      environment.BASE_URL + URLS.country.getAll
    );
  }
}

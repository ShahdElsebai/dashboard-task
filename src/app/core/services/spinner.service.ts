import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpinnerStatus } from '../models/core.model';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  showSpinner: BehaviorSubject<SpinnerStatus>;

  constructor() {
    this.showSpinner = new BehaviorSubject<SpinnerStatus>(SpinnerStatus.HIDE);
  }

  show() {
    this.showSpinner.next(SpinnerStatus.SHOW);
  }

  hide() {
    this.showSpinner.next(SpinnerStatus.HIDE);
  }
}
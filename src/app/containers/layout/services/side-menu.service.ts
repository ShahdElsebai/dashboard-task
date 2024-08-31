import { Injectable } from '@angular/core';
import { SideMenuItem } from '../models/side-menu.model';

@Injectable({
  providedIn: 'root',
})
export class SideMenuService {
  items: SideMenuItem[] = [
    {
      label: 'Users Managements',
      link: '',
    },
  ];
  constructor() {}
  getAllSideMenuItems(): SideMenuItem[] {
    return this.items;
  }
}

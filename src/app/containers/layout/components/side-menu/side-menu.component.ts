import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SideMenuItem } from '../../models/side-menu.model';
import { SideMenuService } from '../../services/side-menu.service';
import { DataLocalStorageService } from './../../../../core/services/data-local-storage.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  menuItems: SideMenuItem[] = [];
  selectedItem!: SideMenuItem;
  constructor(
    private router: Router,
    private sideMenuService: SideMenuService,
    private dataLocalStorageService: DataLocalStorageService
  ) {}
  ngOnInit(): void {
    this.menuItems = this.sideMenuService.getAllSideMenuItems();
    this.selectedItem = this.menuItems[0];
  }
  selectItem(item: SideMenuItem) {
    this.selectedItem = item;
    this.router.navigate([item.link]);
  }
  logoutClicked() {
    this.dataLocalStorageService.clearLocalStorage()
    this.router.navigate(['/login']);
  }
}

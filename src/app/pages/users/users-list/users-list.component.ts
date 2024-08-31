import * as bootstrap from 'bootstrap';
import { Component, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UsersService } from '../services/users.service';
import { User, UserFilters } from '../models/users.model';
import { SpinnerStatus } from 'src/app/core/models/core.model';
import { ResponseAPI } from 'src/app/shared/model/shared.model';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ActionType, TableHeader } from 'src/app/shared/model/table.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  getAllIsLoading = true;
  showErrorToast = false;
  errorMessage = "Something went wrong,couldn't load users.";
  tableHeaders: TableHeader[] = [
    { label: 'ID', name: 'id', type: 'number' },
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Phone', name: 'phone', type: 'text' },
    { label: 'Email', name: 'email', type: 'text' },
    { label: 'Gendar', name: 'gender', type: 'text' },
    { label: 'Date of Birh', name: 'date_of_birth', type: 'date' },
    { label: 'Country', name: 'country_name', type: 'text' },
    { label: 'Type', name: 'type', type: 'text' },
    { label: 'Active', name: 'active', type: 'text' },
    { label: 'Premium', name: 'is_premium', type: 'text' },
  ];

  tableActions: ActionType[] = ['view', 'edit', 'delete', 'toggle'];

  tableData: User[] = [];
  filters: UserFilters = {
    gender: undefined,
    type: undefined,
    is_permium: undefined,
  };
  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    public spinnerService: SpinnerService
  ) {}
  ngOnInit(): void {
    this.listAllUsers();
  }
  listAllUsers() {
    this.getAllIsLoading = true;
    this.usersService
      .getAllUsers(0, this.filters)
      .pipe(
        finalize(() => {
          this.getAllIsLoading =
            this.spinnerService.showSpinner.value === SpinnerStatus.SHOW;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (usersResponse: ResponseAPI<User[] | any>) => {
          if (
            this.filters.gender ||
            this.filters.is_permium  ||
            this.filters.type
          )
            this.setUsersData(usersResponse.data.data);
            else
            this.setUsersData(usersResponse.data);
        },
        error: () => {
          this.getAllIsLoading = false;
          this.showErrorToast = true;
          setTimeout(() => {
            this.showErrorToast = false;
          }, 6000);
        },
      });
  }
  setUsersData(users: User[]) {
    this.tableData = users.map((user: User) => ({
      ...user,
      country_name: user.country ? user.country.name_en : '-',
      active: user.active === 1 ? 'Active' : 'UnActive',
      is_premium: user.is_premium === 1 ? 'Is Premium' : 'Not Premium'
    }));
  }
  handleView(item: User) {
    console.log('View clicked', item);
  }

  handleEdit(item: User) {
    console.log('Edit clicked', item);
  }

  handleDelete(item: User) {
    console.log('Delete clicked', item);
  }
  handleToggleActivation(item: any) {
    console.log('Toggle clicked', item);
  }

  openFilterModal() {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  closeFilterModal(filters: {
    gender?: string;
    type?: string;
    is_permium?: boolean;
  }) {
    console.log(filters);
    this.filters.gender = filters.gender;
    this.filters.is_permium = filters.is_permium ? 1 : 0;
    this.filters.type = filters.type;
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    this.listAllUsers();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

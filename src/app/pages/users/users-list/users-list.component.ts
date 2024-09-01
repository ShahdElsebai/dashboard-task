import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UsersService } from '../services/users.service';
import { User, UserFilters } from '../models/users.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerStatus } from 'src/app/core/models/core.model';
import { ResponseAPI } from 'src/app/shared/model/shared.model';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ActionType, TableHeader } from 'src/app/shared/model/table.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, OnDestroy {
  getAllIsLoading = true;
  existingUser!: User;
  showToast = false;
  isError = false;
  message = 'Something went wrong, please check the data.';
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
    public spinnerService: SpinnerService,
    private router: Router
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
          this.setUsersData(
            this.filtersApplied() ? usersResponse.data.data : usersResponse.data
          );
        },
        error: () => {
          this.handleError("Couldn't load users.");
        },
      });
  }

  private filtersApplied(): boolean {
    return (
      !!this.filters.gender || !!this.filters.is_permium || !!this.filters.type
    );
  }

  private setUsersData(users: User[]): void {
    this.tableData = users.map((user) => ({
      ...user,
      country_name: user.country ? user.country.name_en : '-',
      active: user.active === 1 ? 'Active' : 'Inactive',
      is_premium: user.is_premium === 1 ? 'Is Premium' : 'Not Premium',
    }));
  }

  getColumnClass(columnName: string, value: any): string {
    switch (columnName) {
      case 'active':
        return value === 'Active' ? 'active-column' : 'inactive-column';
      case 'is_premium':
        return value === 'Is Premium' ? 'active-column' : 'inactive-column';
      default:
        return '';
    }
  }

  handleView(item: User): void {
    this.router.navigate([`users/${item.id}`]);
  }

  handleEdit(item: User): void {
    this.existingUser = item;
    this.openModal('updateUserModal');
  }

  handleDelete(item: User): void {
    this.usersService
      .deleteUser(item.id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.listAllUsers()
          this.message = 'user is deleted successfully.';
          this.isError = false;
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 6000);
        },
        error: () => {
          this.message = 'Failed to delete user.';
          this.isError = true;
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 6000);
        },
      });
  }

  handleToggleActivation(item: User): void {
    const isActive = item.active;
    this.usersService
    .toggleUserActivation(item.id)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: () => {
        this.listAllUsers()
        this.message = isActive ? 'User is deactivated successfully.' : 'User is activated successfully.';
        this.isError = false;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 6000);
      },
      error: () => {
        this.message = 'Failed to delete user.';
        this.isError = true;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 6000);
      },
    });
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    this.listAllUsers();
  }

  openFilterModal(): void {
    this.openModal('filterModal');
  }

  closeFilterModal(filters: {
    gender?: string;
    type?: string;
    is_permium?: boolean;
  }): void {
    this.filters = {
      gender: filters.gender,
      type: filters.type,
      is_permium: filters.is_permium ? 1 : 0,
    };
    this.closeModal('filterModal');
  }

  openCreateUserModal(): void {
    this.openModal('createUserModal');
  }

  closeCreateUserModal(): void {
    this.closeModal('createUserModal');
  }

  openUpdateUserModal(): void {
    this.openModal('updateUserModal');
  }

  closeUpdateUserModal(): void {
    this.closeModal('updateUserModal');
  }

  private handleError(message: string): void {
    this.getAllIsLoading = false;
    this.message = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 6000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

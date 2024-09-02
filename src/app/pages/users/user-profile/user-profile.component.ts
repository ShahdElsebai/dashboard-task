import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { User } from '../models/users.model';
import { Subject, finalize, takeUntil } from 'rxjs';
import { SpinnerStatus } from 'src/app/core/models/core.model';
import { ResponseAPI } from 'src/app/shared/model/shared.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userId!: number;
  userData!: User;
  getUserIsLoading = true;
  showToast = false;
  isError = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = +params.get('id')!;
      this.fetchUserData(this.userId);
    });
  }

  fetchUserData(id: number): void {
    this.userService
      .getUserById(id)
      .pipe(
        finalize(() => {
          this.getUserIsLoading =
            this.spinnerService.showSpinner.value === SpinnerStatus.SHOW;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({ 
        next: (usersResponse: ResponseAPI<User>) => {
          this.userData = usersResponse.data;
        },
        error:() => {
          this.getUserIsLoading = false;
          this.message = "Something went wrong, couldn't fetch user data";
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 6000);
        }}
      );
  }

  get fullName(): string {
    if (!this.userData) {
      return '';
    }
    return `${this.userData.name} ${this.userData.father_name} ${this.userData.grandfather_name} ${this.userData.family_branch_name}`;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

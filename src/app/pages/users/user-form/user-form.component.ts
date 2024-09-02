import { finalize, Subject, takeUntil } from 'rxjs';
import { UsersService } from './../services/users.service';
import { SpinnerStatus } from 'src/app/core/models/core.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginatedResponse } from 'src/app/shared/model/shared.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import {
  Country,
  CreateOrUpdateUserRequest,
  User,
} from '../models/users.model';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() userData!: User;
  @Output() closeUserFormModal = new EventEmitter<void>();

  userForm!: FormGroup;
  isLoading = false;
  countries: Country[] = [];
  getDataIsLoading = true;
  showToast = false;
  isError = false;
  message = 'Something went wrong, please check the data.';
  selectedCountry: Country | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
    if (this.userData) {
      this.patchFormWithUserData(this.userData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && changes['userData'].currentValue) {
      this.patchFormWithUserData(changes['userData'].currentValue);
    }
  }

  private initializeForm(): void {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        father_name: [''],
        grandfather_name: [''],
        family_branch_name: [''],
        tribe: [''],
        job: [''],
        date_of_birth: [''],
        gender: [''],
        country_code: [{ value: '', disabled: true }, Validators.required],
        country_id: ['', Validators.required],
        phone: ['', Validators.required],
        phone_code: [{ value: '', disabled: true }, Validators.required],
        active: [0],
        is_premium: [0],
        email: ['', [Validators.required, Validators.email]],
        image: [null],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.setSelectedCountry();
  }

  private passwordMatchValidator(
    formGroup: FormGroup
  ): { mismatch: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get name() {
    return this.userForm.get('name');
  }

  get country_code() {
    return this.userForm.get('country_code');
  }
  get country_id() {
    return this.userForm.get('country_id');
  }
  get phone_code() {
    return this.userForm.get('phone_code');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }
  get password_confirmation() {
    return this.userForm.get('password_confirmation');
  }
  private loadCountries(): void {
    this.sharedService
      .getAllCountries()
      .pipe(
        finalize(() => {
          this.getDataIsLoading =
            this.spinnerService.showSpinner.value === SpinnerStatus.SHOW;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (countriesResponse: PaginatedResponse<Country[]>) => {
          this.countries = countriesResponse.data.data;
        },
        error: () => {
          this.message = 'Failed to load countries.';
          this.isError = true;
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 6000);
        },
      });
  }

  private setSelectedCountry(): void {
    this.userForm.get('country_id')?.valueChanges.subscribe((countryId) => {
      this.selectedCountry =
        this.countries.find((country) => country.id === Number(countryId)) ||
        null;
      if (this.selectedCountry) {
        this.userForm.get('country_code')?.setValue(this.selectedCountry.iso2);
        this.userForm
          .get('phone_code')
          ?.setValue(this.selectedCountry.phonecode);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.userForm.get('image')?.setValue(file);
    }
  }
  //To remove unneede attributs from request
  private filterFormData(formData: any): any {
    return Object.keys(formData).reduce(
      (acc: { [key: string]: any }, key: string) => {
        const value = formData[key];
        if (value !== null && value !== '' && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
  }

  private patchFormWithUserData(user: User): void {
    this.userForm.patchValue(user);
    this.selectedCountry =
      this.countries.find((country) => country.id === user.country_id) || null;
    if (this.selectedCountry) {
      this.userForm.get('country_code')?.setValue(this.selectedCountry.iso2);
      this.userForm.get('phone_code')?.setValue(this.selectedCountry.phonecode);
    }
  }

  private handleApiResponse(successMessage: string): void {
    this.isLoading = false;
    this.closeUserFormModal.emit();
    this.userForm.reset();
    this.message = successMessage;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 6000);
  }

  private handleApiError(error: any): void {
    if (
      error.error &&
      error.error.errors &&
      Array.isArray(error.error.errors)
    ) {
      this.message = error.error.errors.map((err: any) => err.msg).join(' | ');
    } else {
      this.message = 'An unknown error occurred.';
    }
    this.isError = true;
    this.isLoading = false;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 6000);
  }

  private createUser(newUser: CreateOrUpdateUserRequest): void {
    this.usersService
      .createUser(newUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.handleApiResponse('User is created successfully'),
        error: (error) => this.handleApiError(error),
      });
  }

  private updateUser(updatedUser: CreateOrUpdateUserRequest): void {
    this.usersService
      .updateUser(updatedUser, this.userData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.handleApiResponse('User is updated successfully'),
        error: (error) => this.handleApiError(error),
      });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const formData = this.filterFormData(this.userForm.value);
      const user: CreateOrUpdateUserRequest = {
        ...formData,
        phone_code: '+' + this.selectedCountry?.phonecode,
        country_code: this.selectedCountry?.iso2,
        active: formData.active ? 1 : 0,
        is_premium: formData.is_premium ? 1 : 0,
      };
      if (this.userForm.get('image')?.value) {
        user.image = this.userForm.get('image')?.value;
      }
      if (this.userData) {
        this.updateUser(user);
      } else {
        this.createUser(user);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

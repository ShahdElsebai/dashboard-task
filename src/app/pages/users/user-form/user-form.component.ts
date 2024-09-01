import { UsersService } from './../services/users.service';
import { Country, CreateUserRequest } from '../models/users.model';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SpinnerStatus } from 'src/app/core/models/core.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  PaginatedResponse,
  ResponseAPI,
} from 'src/app/shared/model/shared.model';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() userData: any; // Use this input to pass existing user data for update
  @Output() closeUserFormModal = new EventEmitter<void>();

  userForm!: FormGroup;
  isLoading: boolean = false;
  countries: Country[] = [];
  getDataIsLoading = true;
  showToast = false;
  isError = false;
  Message = 'Something went wrong, please check the data.';
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
    this.CountriesDropDownData();
    this.setSelectedCountry();
    // If updating, patch the form with the existing user data
    if (this.userData) {
      this.userForm.patchValue(this.userData);
    }
  }

  initializeForm() {
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
        country_code: ['', Validators.required],
        country_id: ['', Validators.required],
        phone: ['', Validators.required],
        phone_code: ['', Validators.required],
        active: [0],
        is_premium: [0],
        email: ['', [Validators.required, Validators.email]],
        image: [null],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
    this.userForm.get('country_code')?.disable();

    this.userForm.get('phone_code')?.disable();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup?.get('password')?.value;
    const password_confirmation = formGroup?.get(
      'password_confirmation'
    )?.value;
    return password === password_confirmation ? null : { mismatch: true };
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
  CountriesDropDownData() {
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
        error: () => {},
      });
  }
  setSelectedCountry() {
    // Subscribe to changes in the country_id form control
    this.userForm.get('country_id')?.valueChanges.subscribe((countryId) => {
      this.selectedCountry =
        this.countries.find((country) => country.id === Number(countryId)) ||
        null;
      this.userForm.get('country_code')?.setValue(this.selectedCountry?.iso2);
      this.userForm
        .get('phone_code')
        ?.setValue(this.selectedCountry?.phonecode);
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.userForm.patchValue({
      image: file,
    });
  }
  //helper function to filter form data
  filterFormData(formData: any): any {
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

  onSubmit() {
    this.isLoading = true;
    if (this.userForm.valid) {
      let formData = this.userForm.value;
      formData = this.filterFormData(formData);

      const newUser: CreateUserRequest = {
        ...formData,
        phone_code: '+' + this.selectedCountry?.phonecode,
        country_code: this.selectedCountry?.iso2,
        active: formData.active ? 1 : 0,
        is_premium: formData.is_permium ? 1 : 0,
      };
      if (this.userData) {
        // Call the update API
        console.log('Updating user with data:', formData);
        //close model after call api and it success
        this.closeUserFormModal.emit();
        this.userForm.reset();
      } else {
        this.usersService
          .createUser(newUser)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              if (res) {
                this.isLoading = false;
                //close model after call api and it success
                this.closeUserFormModal.emit();
                this.userForm.reset();
                this.Message = 'User is created successfully';
                this.showToast = true;
                setTimeout(() => {
                  this.showToast = false;
                }, 6000);
              }
            },
            error: (error) => {
              if (
                error.error &&
                error.error.errors &&
                Array.isArray(error.error.errors)
              ) {
                const allErrors = error.error.errors
                  .map((err: any) => err.msg)
                  .join(' | ');

                this.Message = allErrors;
              } else {
                this.Message = 'An unknown error occurred.';
              }
              this.isError = true;
              this.isLoading = false;
              this.showToast = true;
              setTimeout(() => {
                this.showToast = false;
              }, 6000);
            },
          });
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

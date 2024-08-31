import { Country } from '../models/users.model';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SpinnerStatus } from 'src/app/core/models/core.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PaginatedResponse, ResponseAPI } from 'src/app/shared/model/shared.model';

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
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.CountriesDropDownData();
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
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup?.get('password')?.value;
    const confirmPassword = formGroup?.get('confirmPassword')?.value;
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
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
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
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.userForm.patchValue({
      image: file,
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      if (this.userData) {
        // Call the update API
        console.log('Updating user with data:', formData);
        //close model after call api and it success
        this.closeUserFormModal.emit();
        this.userForm.reset();
      } else {
        // Call the create API
        console.log('Creating new user with data:', formData);
        //close model after call api and it success
        this.closeUserFormModal.emit();
        this.userForm.reset();
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

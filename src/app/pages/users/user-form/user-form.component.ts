import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();

    // If updating, patch the form with the existing user data
    if (this.userData) {
      this.userForm.patchValue(this.userData);
    }
  }

  initializeForm() {
    this.userForm = this.fb.group({
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
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
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
}

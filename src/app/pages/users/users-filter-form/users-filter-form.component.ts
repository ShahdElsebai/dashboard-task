import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-users-filter-form',
  templateUrl: './users-filter-form.component.html',
  styleUrls: ['./users-filter-form.component.scss'],
})
export class UsersFilterFormComponent {
  userForm: FormGroup;
  @Output() closeFilterModal = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      gender: [null],
      type: [null],
      isPremium: [null],
    });
  }

  onSubmit() {
    console.log(this.userForm.value);
    this.closeFilterModal.emit();
  }
}

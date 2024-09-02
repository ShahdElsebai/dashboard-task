import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-users-filter-form',
  templateUrl: './users-filter-form.component.html',
  styleUrls: ['./users-filter-form.component.scss'],
})
export class UsersFilterFormComponent {
  userForm: FormGroup;
  @Output() closeFilterModal = new EventEmitter<{gender?: string, type?: string, is_permium?: boolean}>();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      gender: [null],
      type: [null],
      is_permium: [null],
    });
  }

  onSubmit() {
    this.closeFilterModal.emit(this.userForm.value);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  CommonModule,
  ReactiveFormsModule,
]
@NgModule({
  declarations: [],
  imports: [
   ...MODULES
  ],
  exports: [
    ...MODULES
  ]
})
export class SharedModule { }

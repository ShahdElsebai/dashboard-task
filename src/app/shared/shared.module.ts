import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TableComponent } from './components/table/table.component';

const MODULES = [CommonModule, ReactiveFormsModule];
const COMPONENTS = [TableComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS],
  providers: [
    DatePipe, 
  ],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { ToastComponent } from './components/toast/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const MODULES = [CommonModule, ReactiveFormsModule];
const COMPONENTS = [TableComponent, ToastComponent, SpinnerComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS],
  providers: [
    DatePipe, 
  ],
})
export class SharedModule {}

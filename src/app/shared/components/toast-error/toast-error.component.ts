import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-error',
  templateUrl: './toast-error.component.html',
  styleUrls: ['./toast-error.component.scss'],
})
export class ToastErrorComponent {
  @Input() isError: boolean=true;
  @Input() Message: string = '';
}

import { DatePipe } from '@angular/common';
import { ActionType, ColumnType, TableHeader } from '../../model/table.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<TData extends Record<string, any>>
  implements OnInit
{
  @Input() headers: TableHeader[] = [];
  @Input() data: TData[] = [];
  @Input() actions: ActionType[] = [];

  @Output() view = new EventEmitter<TData>();
  @Output() edit = new EventEmitter<TData>();
  @Output() delete = new EventEmitter<TData>();
  @Output() toggle = new EventEmitter<TData>();
  @Output() openFilterModal = new EventEmitter<TData>();

  keys: string[] = [];

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    if (this.data.length > 0) {
      this.keys = Object.keys(this.data[0]);
    }
  }

  formatValue(value: any, type: ColumnType): string {
    if (type === 'date') {
      return this.datePipe.transform(value, 'short') || value;
    }
    return value;
  }

  onView(item: TData) {
    this.view.emit(item);
  }

  onEdit(item: TData) {
    this.edit.emit(item);
  }

  onDelete(item: TData) {
    this.delete.emit(item);
  }

  onToggle(item: TData) {
    this.toggle.emit(item);
  }

  openFilterModalClicked() {
    this.openFilterModal.emit();
  }
}

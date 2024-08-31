import { DatePipe } from '@angular/common';
import { ActionType, ColumnType, TableHeader } from '../../model/table.model';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<TData extends Record<string, any>>
  implements OnInit, OnChanges
{
  @Input() headers: TableHeader[] = [];
  @Input() data: TData[] = [];
  @Input() actions: ActionType[] = [];
  @Input() isLoading: boolean = true;
  @Input() getClass?: (columnName: string, value: any) => string;

  @Output() view = new EventEmitter<TData>();
  @Output() edit = new EventEmitter<TData>();
  @Output() delete = new EventEmitter<TData>();
  @Output() toggle = new EventEmitter<TData>();
  @Output() openFilterModal = new EventEmitter<void>();
  @Output() openCreateModal = new EventEmitter<void>();

  keys: string[] = [];
  sortedData: TData[] = [];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['headers']) {
      this.initializeData();
    }
  }

  private initializeData() {
    this.sortedData = [...this.data];
    if (this.sortColumn) {
      const header = this.headers.find(
        (header) => header.name === this.sortColumn
      );
      if (header) {
        this.sortData(header);
      }
    }
  }

  sortData(header: TableHeader) {
    if (!header) {
      return;
    }

    if (this.sortColumn === header.name) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = header.name;
      this.sortDirection = 'asc';
    }

    this.sortedData.sort((a, b) => {
      let valueA = a[header.name];
      let valueB = b[header.name];

      // Handle sorting by type
      if (header.type === 'number') {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      } else if (header.type === 'date') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
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
  onOpenCreateNew() {
    this.openCreateModal.emit();
  }
  openFilterModalClicked() {
    this.openFilterModal.emit();
  }
}

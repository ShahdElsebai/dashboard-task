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
  @Input() toggleColumn: string = ''; // Column name to determine toggle state

  @Output() view = new EventEmitter<TData>();
  @Output() edit = new EventEmitter<TData>();
  @Output() delete = new EventEmitter<TData>();
  @Output() toggle = new EventEmitter<TData>();
  @Output() openFilterModal = new EventEmitter<void>();
  @Output() openCreateModal = new EventEmitter<void>();

  keys: string[] = [];
  sortedData: TData[] = [];
  paginatedData: TData[] = [];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  // Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Track the delete and toggle confirmation visibility
  confirmDelete: { [key: number]: boolean } = {};
  confirmToggle: { [key: number]: boolean } = {};

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
    this.totalItems = this.data.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.sortColumn) {
      const header = this.headers.find(
        (header) => header.name === this.sortColumn
      );
      if (header) {
        this.sortData(header);
      }
    }
    this.updatePagination();
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
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    // After sorting, update pagination
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.sortedData.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
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

  onDeleteConfirmed(item: TData, index: number) {
    this.delete.emit(item);
    this.confirmDelete[index] = false;
  }

  onToggleConfirmed(item: TData, index: number) {
    this.toggle.emit(item);
    this.confirmToggle[index] = false;
  }

  onOpenCreateNew() {
    this.openCreateModal.emit();
  }

  openFilterModalClicked() {
    this.openFilterModal.emit();
  }

  confirmDeleteItem(index: number) {
    this.confirmDelete[index] = true;
  }

  cancelDelete(index: number) {
    this.confirmDelete[index] = false;
  }

  confirmToggleItem(index: number) {
    this.confirmToggle[index] = true;
  }

  cancelToggle(index: number) {
    this.confirmToggle[index] = false;
  }
}

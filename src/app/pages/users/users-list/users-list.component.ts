import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ActionType, TableHeader } from 'src/app/shared/model/table.model';
type User = {
  ID: number;
  Name: string;
  'Date of Birth': Date;
  Country: string;
};

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent {
  tableHeaders: TableHeader[] = [
    { name: 'ID', type: 'number' },
    { name: 'Name', type: 'text' },
    { name: 'Date of Birth', type: 'date' },
    { name: 'Country', type: 'text' }
  ]; 

  tableActions: ActionType[] = ['view', 'edit', 'delete', 'toggle'];

  tableData: User[] = [
    { ID: 1, Name: 'John Doe', 'Date of Birth': new Date('1995-06-15T00:00:00Z'), Country: 'USA' },
    { ID: 2, Name: 'Jane Smith', 'Date of Birth': new Date('1989-08-25T00:00:00Z'), Country: 'Canada' },
    { ID: 3, Name: 'Will Brown', 'Date of Birth': new Date('2000-01-10T00:00:00Z'), Country: 'UK' }
  ];

  handleView(item: User) {
    console.log('View clicked', item);
  }

  handleEdit(item: User) {
    console.log('Edit clicked', item);
  }

  handleDelete(item: User) {
    console.log('Delete clicked', item);
  }
  handleToggleActivation(item: any) {
    console.log('Toggle clicked', item);
  }

  openFilterModal() {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}

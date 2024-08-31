export type ColumnType = 'text' | 'number' | 'date';

export interface TableHeader {
  name: string; 
  type: ColumnType; 
}

export type ActionType = 'view' | 'edit' | 'delete' | 'toggle';
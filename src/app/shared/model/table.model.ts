export type ColumnType = 'text' | 'number' | 'date';

export interface TableHeader {
  name: string; 
  label:string;
  type: ColumnType; 
}

export type ActionType = 'view' | 'edit' | 'delete' | 'toggle';
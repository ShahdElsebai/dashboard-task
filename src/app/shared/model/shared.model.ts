export interface TimeStamp {
  createdAt: string;
  updatedAt: string;
}

export interface ResponseAPI<T> {
  code: number;
  status: number;
  errors: any;
  message: string;
  data: T;
}
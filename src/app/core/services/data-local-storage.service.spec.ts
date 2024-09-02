import { TestBed } from '@angular/core/testing';

import { DataLocalStorageService } from './data-local-storage.service';

describe('DataLocalStorageService', () => {
  let service: DataLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

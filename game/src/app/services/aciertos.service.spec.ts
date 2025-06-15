import { TestBed } from '@angular/core/testing';

import { AciertosService } from './aciertos.service';

describe('AciertosService', () => {
  let service: AciertosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AciertosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

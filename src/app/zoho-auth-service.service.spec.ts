import { TestBed } from '@angular/core/testing';

import { ZohoAuthServiceService } from './zoho-auth-service.service';

describe('ZohoAuthServiceService', () => {
  let service: ZohoAuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZohoAuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

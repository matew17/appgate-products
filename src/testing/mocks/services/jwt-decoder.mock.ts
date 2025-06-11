import { Injectable } from '@angular/core';

@Injectable()
export class MockJwtDecoderService {
  decode = jasmine.createSpy('decode');
}

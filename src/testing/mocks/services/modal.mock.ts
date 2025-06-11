/// <reference types="jasmine" />

export const mockModalService = {
  registerHostViewContainer: jasmine.createSpy('registerHostViewContainer'),
  open: jasmine.createSpy('open').and.returnValue(Promise.resolve(false)),
};

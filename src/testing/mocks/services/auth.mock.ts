import { signal } from '@angular/core';

export const mockAuthService = {
  isAuthenticated: signal(false),
  logout: jasmine.createSpy('logout'),
  userData: signal<any>(null),
  email: signal(''),
};

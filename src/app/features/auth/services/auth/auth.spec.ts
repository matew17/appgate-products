import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

import { AuthService } from './auth';
import { MockOidcSecurityService } from '@mocks/services/oid-security.mock';
import { environment } from '@env/environment';
import { MockJwtDecoderService } from '@mocks/services/jwt-decoder.mock';
import { JwtDecoder } from '@services/jwt-decoder';

describe('AuthService', () => {
  let service: AuthService;
  let oidcSecurityServiceMock: MockOidcSecurityService;
  let jwtDecoderServiceMock: MockJwtDecoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useClass: MockOidcSecurityService },
        { provide: JwtDecoder, useClass: MockJwtDecoderService },
      ],
    });

    service = TestBed.inject(AuthService);
    oidcSecurityServiceMock = TestBed.inject(OidcSecurityService) as any;
    jwtDecoderServiceMock = TestBed.inject(JwtDecoder) as any;
  });

  afterEach(() => {
    oidcSecurityServiceMock.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('State Signals (isAuthenticated and userData)', () => {
    it('isAuthenticated signal should update when oidcSecurityService.isAuthenticated$ emits', fakeAsync(() => {
      expect(service.isAuthenticated()).toBeFalse();

      oidcSecurityServiceMock.setAuthenticated(true);

      tick();

      expect(service.isAuthenticated()).toBeTrue();
    }));

    it('userData signal should update when oidcSecurityService.userData$ emits', fakeAsync(() => {
      const testUser: UserDataResult = {
        userData: { name: 'John Doe' },
        allUserData: [],
      };
      expect(service.userData()).toBeNull();

      oidcSecurityServiceMock.setUserData(testUser);

      tick();

      expect(service.userData()).toEqual(testUser);
    }));
  });

  describe('Method Calls', () => {
    it('handleAuthCallback should call oidcSecurityService.checkAuth', () => {
      service.handleAuthCallback();
      expect(oidcSecurityServiceMock.checkAuth).toHaveBeenCalled();
    });

    it('login should call oidcSecurityService.authorize', () => {
      service.login();
      expect(oidcSecurityServiceMock.authorize).toHaveBeenCalled();
    });
  });

  describe('getUserGroups', () => {
    it('should return null if no token is available', (done) => {
      oidcSecurityServiceMock.setIdToken(null);
      service.getUserGroups().subscribe((groups) => {
        expect(groups).toBeNull();
        done();
      });
    });

    it('should use JwtDecoderService and return the cognito:groups array', (done) => {
      const fakeToken = 'fake.jwt.token';
      const decodedPayload = { 'cognito:groups': ['admins', 'users'] };

      jwtDecoderServiceMock.decode.and.returnValue(decodedPayload);
      oidcSecurityServiceMock.setIdToken(fakeToken);

      service.getUserGroups().subscribe((groups) => {
        expect(groups).toEqual(['admins', 'users']);

        expect(jwtDecoderServiceMock.decode).toHaveBeenCalledWith(fakeToken);

        done();
      });
    });

    it('should return an empty array if cognito:groups claim does not exist', (done) => {
      const fakeToken = 'fake.jwt.token';
      const decodedPayload = { name: 'user' };

      jwtDecoderServiceMock.decode.and.returnValue(decodedPayload);

      oidcSecurityServiceMock.setIdToken(fakeToken);

      service.getUserGroups().subscribe((groups) => {
        expect(groups).toEqual([]);
        done();
      });
    });
  });
});

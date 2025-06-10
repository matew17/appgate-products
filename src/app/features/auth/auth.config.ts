import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority:
      'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_g8ySth0Pt',
    redirectUrl: window.location.origin + '/authorize',
    postLogoutRedirectUri: window.location.origin + '/signout',
    clientId: '2e5940k16kibouevvmjsa7e5dc',
    scope: 'openid email',
    responseType: 'code',
    logLevel: LogLevel.Debug,
  },
};

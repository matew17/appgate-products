import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

import { environment } from '@env/environment';

const { authority, clientId, redirectUrl, postLogoutRedirectUri } =
  environment.auth;

export const authConfig: PassedInitialConfig = {
  config: {
    authority,
    clientId,
    redirectUrl: window.location.origin + redirectUrl,
    postLogoutRedirectUri: window.location.origin + postLogoutRedirectUri,
    scope: 'openid email',
    responseType: 'code',
    logLevel: LogLevel.Debug,
  },
};

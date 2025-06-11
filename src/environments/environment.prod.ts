export const environment = {
  production: true,
  apiUrl: 'https://fakestoreapi.com',
  auth: {
    authority:
      'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_g8ySth0Pt',
    clientId: '2e5940k16kibouevvmjsa7e5dc',
    redirectUrl: '/authorize',
    postLogoutRedirectUri: '/signout',
    logoutUrl:
      'https://us-east-2g8ysth0pt.auth.us-east-2.amazoncognito.com/logout',
  },
};

export interface DecodedIdToken {
  'cognito:groups'?: string[];

  exp?: number;
  iat?: number;
}

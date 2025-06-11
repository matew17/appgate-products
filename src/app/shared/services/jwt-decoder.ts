import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtDecoder {
  decode<T>(token: string): T | null {
    if (!token) {
      return null;
    }

    try {
      return jwtDecode<T>(token);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }
}

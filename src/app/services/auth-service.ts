import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';

  // Store Authentication Token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get Authentication Token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove Token (Logout)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Check If User Is Authenticated.
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Getting User Id
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded: any = jwtDecode(token);
    return decoded.id;
  }

  // Getting User Name
  getUserName(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded: any = jwtDecode(token);
    return decoded.name;
  }

  // Getting User Role
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded: any = jwtDecode(token);
    return decoded.role;
  }

}

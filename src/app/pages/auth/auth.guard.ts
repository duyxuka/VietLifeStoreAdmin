import { AuthService } from '@/shared/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenStorageService, private router: Router,private auth: AuthService) {}

  canActivate(): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    const role = this.auth.getUserRole();

    if (role !== 'Admin') {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}

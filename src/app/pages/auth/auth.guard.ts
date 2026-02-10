import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}

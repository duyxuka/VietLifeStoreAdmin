import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestDto } from '../models/login-request.dto';
import { LoginResponseDto } from '../models/login-response.dto';
import { TokenStorageService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenStorageService) {}

  public login(input: LoginRequestDto): Observable<LoginResponseDto> {
    const params = new URLSearchParams();
    params.set('username', input.username);
    params.set('password', input.password);
    params.set('client_id', environment.oAuthConfig!.clientId!);
    params.set('client_secret', environment.oAuthConfig!.dummyClientSecret!);
    params.set('grant_type', 'password');
    params.set('scope', environment.oAuthConfig!.scope!);

    return this.http.post<LoginResponseDto>(
      environment.oAuthConfig!.issuer + 'connect/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  public refreshToken(refreshToken: string): Observable<LoginResponseDto> {
    const params = new URLSearchParams();
    params.set('client_id', environment.oAuthConfig!.clientId!);
    params.set('client_secret', environment.oAuthConfig!.dummyClientSecret!);
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);

    return this.http.post<LoginResponseDto>(
      environment.oAuthConfig!.issuer + 'connect/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  public isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  public logout(): void {
    this.tokenService.signOut();
  }
}

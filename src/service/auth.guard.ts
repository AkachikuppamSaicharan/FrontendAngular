// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionServiceService} from './session-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.sessionService.isSessionActive()) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}

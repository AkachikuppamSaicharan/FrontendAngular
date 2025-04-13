import { Component } from '@angular/core';
import {SessionServiceService} from '../service/session-service.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ElectricityMangement';
  constructor(
    protected sessionService: SessionServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const isLoggedIn = this.sessionService.isSessionActive();
        const currentUrl = this.router.url;

        const isPublicRoute = ['/login', '/register', '/forgot-password'].includes(currentUrl);

        // Only activate timers for logged-in users on protected pages
        if (isLoggedIn && !isPublicRoute) {
          this.sessionService.resetTimers();  // restart idle timer
        }
      });
  }
}

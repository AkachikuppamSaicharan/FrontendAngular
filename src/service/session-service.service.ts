import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Subscription, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {


  private readonly sessionKey = 'activeSession';
  private readonly timeoutDuration = 2 * 60 * 1000; // 15 minutes
  private readonly warningBefore = 1 * 60 * 1000; // show warning 1 min before logout

  private warningTimerSub?: Subscription;
  private logoutTimerSub?: Subscription;
  private activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];

  public showWarning$ = new Subject<boolean>();

  constructor(private router: Router, private ngZone: NgZone) {
    this.initActivityListeners();
    this.checkBrowserClose();
  }

  startSession() {
    sessionStorage.setItem(this.sessionKey, 'true');
    this.resetTimers();
  }

  resetTimers() {
    this.clearTimers();
    const warningTime = this.timeoutDuration - this.warningBefore;

    this.warningTimerSub = timer(warningTime).subscribe(() => {
      this.showWarning$.next(true);
    });

    this.logoutTimerSub = timer(this.timeoutDuration).subscribe(() => {
      this.logout();
    });
  }

  continueSession() {
    this.showWarning$.next(false);
    this.resetTimers();
  }

  logout() {
    sessionStorage.removeItem(this.sessionKey);
    this.clearTimers();
    this.showWarning$.next(false);
    this.router.navigate(['']);
  }

  isSessionActive(): boolean {
    return sessionStorage.getItem(this.sessionKey) === 'true';
  }

  private clearTimers() {
    this.warningTimerSub?.unsubscribe();
    this.logoutTimerSub?.unsubscribe();
  }

  private initActivityListeners() {
    this.activityEvents.forEach(event =>
      window.addEventListener(event, () => {
        if (this.isSessionActive()) {
          this.resetTimers(); // only reset timer if logged in
        }
      })
    );
  }


  private checkBrowserClose() {
    window.addEventListener('beforeunload', () => this.logout());
  }
}

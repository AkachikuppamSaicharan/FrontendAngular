import { Component } from '@angular/core';
import {SessionServiceService} from '../../service/session-service.service';

@Component({
  selector: 'app-session-warning',
  standalone: false,
  templateUrl: './session-warning.component.html',
  styleUrl: './session-warning.component.css'
})
export class SessionWarningComponent {
  show = false;

  constructor(private sessionService: SessionServiceService) {
    this.sessionService.showWarning$.subscribe(value => {
      this.show = value;
    });
  }

  continue() {
    this.sessionService.continueSession();
  }

  logout() {
    this.sessionService.logout();
  }
}

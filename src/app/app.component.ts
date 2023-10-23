import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppSettings } from './app.settings';
import { SessionService } from './auth/session.service';
import { SystemService } from './services/system.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SystemService],
})
export class AppComponent {
  title = 'SCGD-WebApp';

  public constructor(
    private titleService: Title,
    private system: SystemService,
    private session: SessionService,
    private router: Router
  ) {
    this.titleService.setTitle(AppSettings.APP_TITLE);
  }

  ngOnInit() {
    if (
      !localStorage.getItem('expiresIn') ||
      localStorage.getItem('expiresIn') === '0'
    ) {
      this.session.deleteSession();
      this.router.navigate(['/login']);
    }
  }
}

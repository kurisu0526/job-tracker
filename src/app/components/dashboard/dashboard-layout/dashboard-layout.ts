import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private auth = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  readonly currentUser$ = this.auth.currentUser$;

  isSmallScreen = false;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, '(max-width: 768px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
        this.updateSidenavState();
      });
  }

  ngAfterViewInit(): void {
    // The DOM is now ready! Force an initial check to close it if small screen.
    // Wrap in a microtask (setTimeout) to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.updateSidenavState();
    });
  }

  private updateSidenavState(): void {
    // Safe guard: check if sidenav is defined yet
    if (!this.sidenav) return;

    if (this.isSmallScreen) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

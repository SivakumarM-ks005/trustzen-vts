import { Injectable, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { ConfirmDialogComponent } from '../../Popup-Alert/confirm-dialog/confirm-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private timeoutId: any;
  private timeoutDuration: number; // in milliseconds
  private events: string[] = ['mousemove', 'click', 'keypress', 'scroll', 'touchstart'];
  private isTimeoutRunning = false; // Flag to prevent multiple timeouts
  private isPopupDisplayed = false; // Flag to prevent repeated popups

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  startSessionTimeout(sessionTimeOut: boolean, sessionTextField: number, sessionMinsSeconds: string): void {
    if (this.isTimeoutRunning) {
      return; // Exit if a timeout is already running
    }

    if (!sessionTimeOut) {
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Session timeout is only supported in the browser.');
      return;
    }

    this.isTimeoutRunning = true; // Mark the timeout as running
    this.isPopupDisplayed = false; // Reset popup flag when starting a new session
    this.timeoutDuration =
      sessionMinsSeconds === 'Minutes'
        ? sessionTextField * 60 * 1000
        : sessionTextField * 1000;

    this.clearTimeout();
    this.addActivityListeners();
    this.resetTimeout();
  }

  private resetTimeout(): void {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      if (!this.isPopupDisplayed) {
        this.logoutUser();
      }
    }, this.timeoutDuration);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private logoutUser(): void {
    this.isPopupDisplayed = true; // Mark the popup as displayed

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
      width: '35%',
      height: '40%',
      position: {
        top: 'calc(10vw + 20px)',
      },
      panelClass: 'confirmdialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/'], { skipLocationChange: true, replaceUrl: true });
        this.stopSessionTimeout(); // Stop the session timeout completely
      } else {
        this.isPopupDisplayed = false; // Allow the popup to appear again if needed
        this.resetTimeout();
      }
    });
  }

  private addActivityListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      this.events.forEach(event => {
        window.addEventListener(event, this.activityDetected);
      });
    });
  }

  private removeActivityListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.events.forEach(event => {
      window.removeEventListener(event, this.activityDetected);
    });
  }

  private activityDetected = (): void => {
    this.ngZone.run(() => {
      this.resetTimeout();
    });
  };

  stopSessionTimeout(): void {
    this.clearTimeout();
    this.removeActivityListeners();
    this.isTimeoutRunning = false; // Mark the timeout as not running
    this.isPopupDisplayed = false; // Reset popup flag
  }
}



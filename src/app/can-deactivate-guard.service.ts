import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './modules/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true
      });

      return dialogRef.afterClosed();
    // if (nextState && nextState.url.includes('vanavihari.com')) {
    // } else {
    //   return true;
    // }
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot,NavigationEnd,Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vKYC';
  private routerEventsSubscription: Subscription;

  constructor(private router: Router) {
    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Get the current route snapshot
        const currentRoute = this.router.routerState.snapshot.root;

        // Check if the current route has 'booking-summary' in its path
        const hasBookingSummary = this.checkBookingSummaryRoute(currentRoute);

        // Log the status
        if(hasBookingSummary){
          localStorage.setItem('isSummary','yes')

        }
        else{
          localStorage.setItem('showCancel','yes')
          localStorage.setItem('isSummary','no')
        }
      }
    });
  }

 
  checkBookingSummaryRoute(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig && route.routeConfig.path && route.routeConfig.path.includes('booking-summary')) {
      return true;
    }

    // Traverse through the parent route until reaching the root
    let parentRoute = route.firstChild;
    while (parentRoute) {
      if (parentRoute.routeConfig && parentRoute.routeConfig.path && parentRoute.routeConfig.path.includes('booking-summary')) {
        return true;
      }
      parentRoute = parentRoute.firstChild;
    }

    return false;
  }

}

// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class MaskUrlGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     console.log('🚀 MaskUrlGuard Activated');

//     // Store route parameters in sessionStorage (to retrieve later)
//     const params = { ...route.params, ...route.queryParams };
//     sessionStorage.setItem('maskedParams', JSON.stringify(params));

//     // Redirect to a common masked route without exposing params
//     this.router.navigate(['/masked-route'], { replaceUrl: true });
//     return false;
//   }
// }

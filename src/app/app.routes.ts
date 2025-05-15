import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardMenusComponent } from './dashboard-menus/dashboard-menus.component';
// import { MaskedRouteComponent } from './masked-route.component';
// import { MaskUrlGuard } from './core/auth-guard/mask-url.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: '/trustzen',
    pathMatch: 'full'
  },
  {
    path: 'trustzen',
    loadComponent: () => import('./home-page/home-page.component').then(n => n.HomePageComponent)
  },
  
  // {
  //   path: 'krya',
  //   // component: DashboardLayoutComponent,
  //   loadComponent: () => import('./dashboard-layout/dashboard-layout.component').then(n => n.DashboardLayoutComponent),
  //   children: [
  //     {
  //       path: 'dashboard',
  //       // component: DashboardComponent,
  //       loadComponent: () => import('./dashboard/dashboard.component').then(n => n.DashboardComponent)
  //     },
  //     {
  //       path: 'dashboard-menu',
  //       // component: DashboardMenusComponent,
  //       loadComponent: () => import('./dashboard-menus/dashboard-menus.component').then(n => n.DashboardMenusComponent),
  //     },
      
      
  //   ]
  // },
  {
    path: '**', redirectTo: '/ProcureZen',
    pathMatch: 'full'
  }

];

// function canActivate(reason: any): Type<unknown> | DefaultExport<Type<unknown>> | PromiseLike<Type<unknown> | DefaultExport<Type<unknown>>> {
//   throw new Error('Function not implemented.');
// }
// // @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRouting { }

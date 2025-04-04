// import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
// import { SupplierUserFormComponent } from './supplier-user-form/supplier-user-form.component';

// @Component({
//   selector: 'app-masked-route',
//   template: `<ng-container #dynamicComponent></ng-container>`
// })
// export class MaskedRouteComponent implements OnInit {
//   constructor(private vcr: ViewContainerRef) {}

//   async ngOnInit() {
//     const maskedParams = sessionStorage.getItem('maskedParams');
//     if (maskedParams) {
//       const params = JSON.parse(maskedParams);
//       console.log('🔹 Loading Component with Params:', params);

//       // Dynamically create SupplierUserFormComponent
//       const { SupplierUserFormComponent } = await import('./supplier-user-form/supplier-user-form.component');
//       this.vcr.createComponent(SupplierUserFormComponent);
//     }
//   }
// }

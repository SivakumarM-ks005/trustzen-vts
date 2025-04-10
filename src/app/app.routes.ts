import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupplierRegistrationComponent } from './supplier-registration/supplier-registration.component';
import { SupplierUserFormComponent } from './supplier-user-form/supplier-user-form.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { PqAssesmentListComponent } from './supplier-user-form/pq-assesment-list/pq-assesment-list.component';
import { PQBuyerUserComponent } from './supplier-user-form/pq-buyer-user/pq-buyer-user.component';
import { PqApplicationComponent } from './supplier-user-form/pq-application/pq-application.component';
import { ContractTemplateListComponent } from './contracts/contract-template-list/contract-template-list.component';
import { ContractTemplateComponent } from './contracts/contract-template/contract-template.component';
import { ContractRepositoryComponent } from './contracts/contract-repository/contract-repository.component';
import { ContractFormComponent } from './contracts/contract-form/contract-form.component';
import { ContractViewComponent } from './contracts/contract-view/contract-view.component';
import { ContractInsightsComponent } from './contracts/contract-insights/contract-insights.component';
import { EditTemplateComponent } from './contracts/edit-template/edit-template.component';
import { ClauseLibraryComponent } from './contracts/clause-library/clause-library.component';
import { ClauseLibraryListComponent } from './clause-library/clause-library-list/clause-library-list.component';
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
  {
    path: 'SupplierRegForm',
    // component: SupplierRegistrationComponent,
    loadComponent: () => import('./supplier-registration/supplier-registration.component').then(n => n.SupplierRegistrationComponent)
  },
  {
    path: 'SupplierUserForm',
    loadComponent: () => import('./supplier-user-form/supplier-user-form.component')
      .then(m => m.SupplierUserFormComponent),
    // canActivate: [MaskUrlGuard], 
    // data: { componentType: 'SupplierUserForm' }
  },
  {
    path: 'krya',
    // component: DashboardLayoutComponent,
    loadComponent: () => import('./dashboard-layout/dashboard-layout.component').then(n => n.DashboardLayoutComponent),
    children: [
      {
        path: 'dashboard',
        // component: DashboardComponent,
        loadComponent: () => import('./dashboard/dashboard.component').then(n => n.DashboardComponent)
      },
      {
        path: 'dashboard-menu',
        // component: DashboardMenusComponent,
        loadComponent: () => import('./dashboard-menus/dashboard-menus.component').then(n => n.DashboardMenusComponent),
      },
      {
        path: 'dashboardSupReg',
        // component: PQBuyerUserComponent,
        loadComponent: () => import('./supplier-user-form/supplier-user-form.component').then(n => n.SupplierUserFormComponent)
      },
      {
        path: 'dashboardSupReg/profile/:profile',
        // component: PQBuyerUserComponent,
        loadComponent: () => import('./supplier-user-form/supplier-user-form.component').then(n => n.SupplierUserFormComponent)
      },
      {
        path: 'dashboardSupReg/status/:status',
        // component: PQBuyerUserComponent,
        loadComponent: () => import('./supplier-user-form/supplier-user-form.component').then(n => n.SupplierUserFormComponent)
      },
      {
        path: 'dashboardSupReg/id/:id/:status',
        // component: PQBuyerUserComponent,
        loadComponent: () => import('./supplier-user-form/supplier-user-form.component').then(n => n.SupplierUserFormComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics.component').then(n => n.AnalyticsComponent)
      },
      {
        path: 'dashboardSupTer/id/:id',
        loadComponent: () => import('./supplier-user-form/suspension-termination/suspension-termination.component').then(n => n.SuspensionTerminationComponent)
      },
      {
        path: 'pq-assesment',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./supplier-user-form/pq-assesment-list/pq-assesment-list.component').then(n => n.PqAssesmentListComponent)
      },
      {
        path: 'PQAssesmentList',
        // component: PqApplicationComponent,
        loadComponent: () => import('./supplier-user-form/pq-application/pq-application.component').then(n => n.PqApplicationComponent)
      },
      {
        path: 'ClauseLibrary',
        // component: ClauseLibraryComponent,
        loadComponent: () => import('./contracts/clause-library/clause-library.component').then(n => n.ClauseLibraryComponent)
      },
      {
        path: 'contractTemplateList',
        // component: ContractTemplateListComponent,
        loadComponent: () => import('./contracts/contract-template-list/contract-template-list.component').then(n => n.ContractTemplateListComponent)
      },
      {
        path: 'contractTemplate',
        // component: ContractTemplateComponent,
        loadComponent: () => import('./contracts/contract-template/contract-template.component').then(n => n.ContractTemplateComponent)
      },
      {
        path: 'contractRepository',
        // component: ContractRepositoryComponent,
        loadComponent: () => import('./contracts/contract-repository/contract-repository.component').then(n => n.ContractRepositoryComponent)
      },
      {
        path: 'contractForm',
        // component: ContractFormComponent,
        loadComponent: () => import('./contracts/contract-form/contract-form.component').then(n => n.ContractFormComponent)
      },
      {
        path: 'contractView',
        // component: ContractViewComponent,
        loadComponent: () => import('./contracts/contract-view/contract-view.component').then(n => n.ContractViewComponent)
      },
      {
        path: 'contractInsights',
        // component: ContractInsightsComponent,
        loadComponent: () => import('./contracts/contract-insights/contract-insights.component').then(n => n.ContractInsightsComponent)
      },
      {
        path: 'editTemplate',
        // component: EditTemplateComponent,
        loadComponent: () => import('./contracts/edit-template/edit-template.component').then(n => n.EditTemplateComponent)
      },
      {
        path: 'clauseLibraryList',
        // component: ClauseLibraryListComponent,
        loadComponent: () => import('./clause-library/clause-library-list/clause-library-list.component').then(n => n.ClauseLibraryListComponent)
      },
      {
        path: 'workFlowList',
        loadComponent: () => import('./workflow/work-flow-approval/work-flow-approval.component').then(n => n.WorkFlowApprovalComponent)
      },
      {
        path: 'workFlowScoreCard',
        loadComponent: () => import('./workflow/workflow-pq-score-card/workflow-pq-score-card.component').then(n => n.WorkflowPqScoreCardComponent)
      },
      {
        path: 'itemMasterList',
        loadComponent: () => import('./inventory-master/item-master-list/item-master-list.component').then(n => n.ItemMasterListComponent)
      },
      {
        path: 'itemMaster',
        loadComponent: () => import('./inventory-master/new-item-master/new-item-master.component').then(n => n.NewItemMasterComponent)
      },
      {
        path: 'materialReceipts',
        loadComponent: () => import('./inventory-master/material-receipts/material-receipts.component').then(n => n.MaterialReceiptsComponent)
      },
     
      {
        path: 'purchaseRequestList',
        loadComponent: () => import('./purchase-requests/purchase-request-list/purchase-request-list.component').then(n => n.PurchaseRequestListComponent)
      },
      {
        path: 'addPurchaseRequestList',
        loadComponent: () => import('./purchase-requests/add-purchase-request/add-purchase-request.component').then(n => n.AddPurchaseRequestComponent)
      },
      {
        path: 'materialRequestList',
        loadComponent: () => import('./material-requests/material-request-list/material-request-list.component').then(n => n.MaterialRequestListComponent)
      },
      {
        path: 'addMaterialRequest',
        loadComponent: () => import('./material-requests/add-material-request/add-material-request.component').then(n => n.AddMaterialRequestComponent)
      },
      {
        path: 'rfq-list',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./request-quotation/rfq-list/rfq-list.component').then(n => n.RfqListComponent)
      },
      {
        path: 'new-rfq',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./request-quotation/new-rfq/new-rfq.component').then(n => n.NewRfqComponent)
      },
      {
        path: 'new-rfq/:id',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./request-quotation/new-rfq/new-rfq.component').then(n => n.NewRfqComponent)
      },
      {
        path: 'new-rfq/:request',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./request-quotation/new-rfq/new-rfq.component').then(n => n.NewRfqComponent)
      },
      {
        path: 'rfq-response',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./request-quotation/rfq-response/rfq-response.component').then(n => n.RfqResponseComponent)
      },
      {
        path: 'transit-agency',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./master-services/service-requests/service-requests.component').then(n => n.ServiceRequestsComponent)
      },
      {
        path: 'form60',
        // component: PqAssesmentListComponent,
        loadComponent: () => import('./master-services/form60/form60.component').then(n => n.Form60Component)
      },
      { 
        path: 'easyview',
        loadComponent: () => import('./easy-view/easy-view.component').then(n => n.EasyViewComponent),
        // component: MaskedRouteComponent // Handle masked data dynamically
      },
      { 
        path: 'cqa',
        loadComponent: () => import('./cqa/cqa.component').then(n => n.CqaComponent),
        // component: MaskedRouteComponent // Handle masked data dynamically
      }
      ,
      {
        path: 'purchaseorderlist',
        loadComponent: () => import('./purchase-order/purchase-order.component').then(n => n.PurchaseOrderComponent)
      },
      {
        path: 'addpurchaseorder',
        loadComponent: () => import('./purchase-order/addpurchase-order-list/addpurchase-order-list.component').then(n => n.AddpurchaseOrderListComponent)
      },
      {
        path: 'addsupplierpurchaseorder',
        loadComponent: () => import('./purchaseorder-supplier-form/purchaseorder-supplier-form.component').then(n => n.PurchaseorderSupplierFormComponent)
      },
      {
        path: 'authorizeOpening',
        loadComponent: () => import('./request-quotation/authorize-opening/authorize-opening.component').then(n => n.AuthorizeOpeningComponent)
      },
      {
        path: 'rfxInsights',
        loadComponent: () => import('./request-quotation/rfx-insights/rfx-insights.component').then(n => n.RfxInsightsComponent)
      },
      {
        path: 'evaluation',
        loadComponent: () => import('./request-quotation/evaluation/evaluation.component').then(n => n.EvaluationComponent)
      },
      {
        path: 'extend-validity',
        loadComponent: () => import('./request-quotation/extension-validity/extension-validity.component').then(n => n.ExtensionValidityComponent)
      },
      {
        path: 'post-tender-queries',
        loadComponent: () => import('./request-quotation/post-tender-queries/post-tender-queries.component').then(n => n.PostTenderQueriesComponent)
      },
    ]
  },
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

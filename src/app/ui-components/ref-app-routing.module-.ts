import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, NavigationGuard, RoleGuard, SessionGuard } from '@app/_helpers';
import { Login1Component } from './components/login1/login1.component';

import { LayoutComponent } from './components/layout/layout.component';
import { SupplierInfoComponent } from './components/supplier/supplier-info/supplier-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardTendersComponent } from './components/dashboard-tenders/dashboard-tenders.component';
import { SupplierAddressDetailsComponent } from './components/supplier/supplier-address-details/supplier-address-details.component';
import { SupplierContactDetailsComponent } from './components/supplier/supplier-contact-details/supplier-contact-details.component';
import { SupplierFinancialBusinessComponent } from './components/supplier/supplier-financial-business/supplier-financial-business.component';
import { SupplierBankDetailsComponent } from './components/supplier/supplier-bank-details/supplier-bank-details.component';
import { SupplierCategoryScopeComponent } from './components/supplier/supplier-category-scope/supplier-category-scope.component';
import { AttachmentDetailsComponent } from './components/supplier/attachment-details/attachment-details.component';
import { FinalViewComponent } from './components/supplier/final-view/final-view.component';
import { PreviewComponent } from './components/supplier/preview/preview.component';
import { SupplierInformationComponent } from './components/supplier/supplier-information/supplier-information.component';
import { DashboardContactsComponent } from './components/dashboard-contacts/dashboard-contacts.component';
import { ClaimSearchComponent } from './components/contracts/claim-search/claim-search.component';
import { VariationOrderSearchComponent } from './components/contracts/variation-order-search/variation-order-search.component';
import { ContractSearchComponent } from './components/contracts/contract-search/contract-search.component';
import { CompletionCertificateSearchComponent } from './components/milestone-completion/completion-certificate-search/completion-certificate-search.component';
import { InvoiceSearchComponent } from './components/payment/invoice-search/invoice-search.component';
import { InvoiceDetailsComponent } from './components/payment/invoice-details/invoice-details.component';
import { InnerDashboardComponent } from './components/dashboard-module/inner-dashboard/inner-dashboard.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { ContractInformationComponent } from './components/contracts/contract-information/contract-information.component';
import { SupplierInfoAddComponent } from './components/supplier/supplier-info-add/supplier-info-add.component';
import { SupplierInfoEditComponent } from './components/supplier/supplier-info-edit/supplier-info-edit.component';
import { ContractEditComponent } from './components/contracts/contract-edit/contract-edit.component';
import { ClaimEditComponent } from './components/contracts/claim-edit/claim-edit.component';
import { ValidationOrderDetailsComponent } from './components/contracts/validation-order-details/validation-order-details.component';
import { MilestoneCompletionDetailsComponent } from './components/milestone-completion/milestone-completion-details/milestone-completion-details.component';
import { PublicTendersComponent } from './components/tenders/public-tenders/public-tenders.component';
import { LimitedTendersComponent } from './components/tenders/limited-tenders/limited-tenders.component';
import { RfiComponent } from './components/tenders/rfi/rfi.component';
import { AuctionComponent } from './components/tenders/auction/auction.component';
import { CustomerDashboardComponent } from './components/dashboard/customer-dashboard/customer-dashboard.component';
import { SupplierPrequalificationComponent } from './components/supplier/supplier-prequalification/supplier-prequalification.component';
import { CompanyScoreCardComponent } from './components/supplier/company-score-card/company-score-card.component';
import { SupplierScoreCardSummaryComponent } from './components/supplier/supplier-score-card-summary/supplier-score-card-summary.component';
import { PublicTenderDetailsComponent } from './components/tenders/public-tender-details/public-tender-details.component';
import { TenderDetailsComponent } from './components/tenders/tender-details/tender-details.component';
import { LimitedTenderSearchComponent } from './components/tenders/limited-tender-search/limited-tender-search.component';
import { TenderSearchComponent } from './components/tenders/tender-search/tender-search.component';
import { RfiDetailsComponent } from './components/tenders/rfi-details/rfi-details.component';
import { AuctionDetailsComponent } from './components/tenders/auction-details/auction-details.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { LinkingContractComponent } from './components/contracts/linking-contract/linking-contract.component';
import { TempCreateComponent } from './components/contracts/temp-create/temp-create.component';
import { LinkTempContractComponent } from './components/contracts/link-temp-contract/link-temp-contract.component';
import { PostQueriesComponent } from './components/tenders/post-queries/post-queries.component';
import { PublishedNotificationsDetailComponent } from './components/tenders/published-notifications-detail/published-notifications-detail.component';
import { TenderSubmissionComponent } from './components/tenders/tender-submission/tender-submission.component';
import { ConsolidatedQuestionsAnswerComponent } from './components/tenders/consolidated-questions-answer/consolidated-questions-answer.component';
import { CreateClaimComponent } from './components/contracts/create-claim/create-claim.component';
import { CreateInvoiceComponent } from './components/payment/create-invoice/create-invoice.component';
import { CreateNewRegistrationComponent } from './components/create-new-registration/create-new-registration.component';
import { RfiSearchComponent } from './components/tenders/rfi-search/rfi-search.component';
import { AuctionDetailOnlineComponent } from './components/tenders/auction-detail-online/auction-detail-online.component';

import { MilestoneCompletionViewComponent } from './components/milestone-completion/milestone-completion-view/milestone-completion-view.component';
import { MilestoneCompletionSearchComponent } from './components/milestone-completion/milestone-completion-search/milestone-completion-search.component';
import { InvoiceContractSearchComponent } from './components/payment/invoice-contract-search/invoice-contract-search.component';
import { InvoiceViewComponent } from './components/payment/invoice-view/invoice-view.component';
import { QueriesSubmittedComponent } from './components/reusable/queries-submitted/queries-submitted.component';
import { QueriesNotificationComponent } from './components/tenders/queries-notification/queries-notification.component';
import { EntityAssignmentComponent } from './components/supplier/entity-assignment/entity-assignment.component';
import { CustomerVendorCollabrationComponent } from './components/supplier/customer-vendor-collabration/customer-vendor-collabration.component';
import { ClaimsContractSearchComponent } from './components/contracts/claims-contract-search/claims-contract-search.component';
import { DashboardContractMgtSystemComponent } from './components/dashboard-contract-mgt-system/dashboard-contract-mgt-system.component';
import { SupplierRegistrationPreviewComponent } from './components/supplier-registration-preview/supplier-registration-preview.component';


import { ContractCreationComponent } from './components/contracts/contract-creation/contract-creation.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

import { SupplierTerminationListComponent } from './components/supplier/supplier-termination-list/supplier-termination-list.component';
import { SupplierTerminationProcessComponent } from './components/supplier/supplier-termination-process/supplier-termination-process.component';
import { ContractCreationRepositoryComponent } from './components/contracts/contract-creation-repository/contract-creation-repository.component';
import { WorkflowListComponent } from './components/workflow/workflow-list/workflow-list.component';
import { RequestForTendersInfoComponent } from './RFT/request-for-tenders-info/request-for-tenders-info.component';
import { PreRequisitesComponent } from './RFT/pre-requisites/pre-requisites.component';
import { SupplierAssignmentComponent } from './RFT/supplier-assignment/supplier-assignment.component';
import { ResponseDocSetComponent } from './RFT/response-doc-set/response-doc-set.component';
import { RftDocSetComponent } from './RFT/rft-doc-set/rft-doc-set.component';
import { QueriesClarificationsComponent } from './RFT/queries-clarifications/queries-clarifications.component';
import { RftActionsComponent } from './RFT/rft-actions/rft-actions.component';
import { RftEvaluationComponent } from './RFT/rft-evaluation/rft-evaluation.component';
import { PrDetailsComponent } from './RFT/pr-details/pr-details.component';
import { EvaluationDefinitionComponent } from './RFT/evaluation-definition/evaluation-definition.component';
import { RftPublishComponent } from './RFT/rft-publish/rft-publish.component';
import { RftInsightSearchComponent } from './RFT/rft-insight-search/rft-insight-search.component';
import { RftInsightsComponent } from './RFT/rft-insights/rft-insights.component';
import { TenderViewComponent } from './components/tender-view/tender-view.component';
import { DownloadRfpComponent } from './components/tenders/download-rfp/download-rfp.component';
import { RftNotificationComponent } from './RFT/rft-notification/rft-notification.component';
import { ClaimInfoComponent } from './components/contracts/claim-info/claim-info.component';
import { CompareContractsComponent } from './components/contracts/compare-contracts/compare-contracts.component';
import { UserActivateAlertComponent } from './components/user-activate-alert/user-activate-alert.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TechnicalParticipantsComponent } from './RFT/technical-participants/technical-participants.component';
import { CommercialParticipantsComponent } from './RFT/commercial-participants/commercial-participants.component';
import { AuctionParticipantComponent } from './components/tenders/auction-participant/auction-participant.component';
import { PqQuestionnaireComponent } from './components/pq-questionnaire/pq-questionnaire.component';
import { LandingComponent } from './components/landing/landing.component';
import { Landing1Component } from './components/landing1/landing1.component'
import { NotificationRequestsComponent } from './components/notification/notification-requests/notification-requests.component'
import { TenderOpeningAuctionComponent } from './components/tenders/tender-opening-auction/tender-opening-auction.component';
import { RequestQuotationComponent } from './RFQ/request-quotation/request-quotation.component';
import { RfqResponseComponent } from './RFQ/rfq-response/rfq-response.component';
import { ComparativeQuotationComponent } from './RFQ/comparative-quotation/comparative-quotation.component';
import { PurchaseOrderComponent } from './RFQ/purchase-order/purchase-order.component';

import { ShipmentTrackingComponent } from './components/shipment/shipment-tracking/shipment-tracking.component';
import { ShipmentDetailsComponent } from './components/shipment/shipment-details/shipment-details.component';
import { ShipmentSummaryComponent } from './components/shipment/shipment-summary/shipment-summary.component';
import { ShipmentBillDetailsComponent } from './components/shipment/shipment-bill-details/shipment-bill-details.component';
import { ViewPublicTendersComponent } from './components/tenders/view-public-tenders/view-public-tenders.component';
import { AddentityassignmentComponent } from './components/addentityassignment/addentityassignment.component';
import { RfqListComponent } from './RFQ/rfq-list/rfq-list.component';
import { JourneyhubComponent } from './components/journeyhub/journeyhub.component';
import { RftTenderopeningsearchComponent } from './RFT/rft-tenderopeningsearch/rft-tenderopeningsearch.component';
import { RftTenderopenTypeComponent } from './RFT/rft-tenderopen-type/rft-tenderopen-type.component';
import { PoListComponent } from './RFQ/po-list/po-list.component';
import { CreateInvoiceViewComponent } from './components/payment/create-invoice-view/create-invoice-view.component';
import { InvoiceSearchBuyerComponent } from './components/payment/invoice-search-buyer/invoice-search-buyer.component';
import { SysAdminConfigComponent } from './admin/sys-admin-config/sys-admin-config.component';
import { DashboardInvoicesComponent } from './components/dashboard-invoices/dashboard-invoices.component';
import { TemplateRepositoryComponent } from './components/contracts/template-repository/template-repository.component';
import { ContractCreationViewComponent } from './components/contracts/contract-creation-view/contract-creation-view.component';
import { NotificationListComponent } from './components/notification/notification-list/notification-list.component';
import { DashboardManageContractsComponent } from './components/dashboard-manage-contracts/dashboard-manage-contracts.component';
import { DashboardWorkcompletionComponent } from './components/dashboard-workcompletion/dashboard-workcompletion.component';
import { CompletionCertificateSearchBuyerComponent } from './components/milestone-completion/completion-certificate-search-buyer/completion-certificate-search-buyer.component';
import { SupplierDashboardComponent } from './components/supplier/supplier-dashboard/supplier-dashboard.component';
import { ContractCancellationComponent } from './contract-cancellation/contract-cancellation.component';
import { ViewRfqComponent } from './RFQ/view-rfq/view-rfq.component';
import { ViewRftComponent } from './RFT/view-rft/view-rft.component';
import { PoCancellationComponent } from './RFQ/po-cancellation/po-cancellation.component';
import { RftExtensionComponent } from './RFT/rft-extension/rft-extension.component';
import { RftCancellationComponent } from './RFT/rft-cancellation/rft-cancellation.component';
import { PerformanceSupplierResponseComponent } from './components/performanceEvaluation/performance-supplier-response/performance-supplier-response.component';
import { PerformanceEvalListComponent } from './components/performanceEvaluation/performance-eval-list/performance-eval-list.component';
import { PerformanceBuyerReviewComponent } from './components/performanceEvaluation/performance-buyer-review/performance-buyer-review.component';
import { RftReviewComponent } from './RFT/rft-review/rft-review.component';
import { EvaluationCreationComponent } from './components/performanceEvaluation/evaluation-creation/evaluation-creation.component';
import { EvaluationListComponent } from './components/performanceEvaluation/evaluation-list/evaluation-list.component';
import { DashboardPerformanceComponent } from './components/dashboard-performance/dashboard-performance.component';
import { PerformanceProcureHeadResponsesComponent } from './components/performanceEvaluation/performance-procure-head-responses/performance-procure-head-responses.component';
import { SupplierEntityAssignmentComponent } from './components/supplier/supplier-entity-assignment/supplier-entity-assignment.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { SpotfireViewerComponent } from './components/spotfire/spotfire-viewer/spotfire-viewer.component';
import { PoReleaseOrderComponent } from './RFQ/po-release-order/po-release-order.component';
import { DashboardProductComponent } from './components/dashboard-product/dashboard-product.component';
import { ProductMasterComponent } from './components/product/product-master/product-master.component';
import { CatalogueMasterComponent } from './components/product/catalogue-master/catalogue-master.component';
import { CatalogueListComponent } from './components/product/catalogue-list/catalogue-list.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { SupplierAdditionComponent } from './components/reusable/supplier-addition/supplier-addition.component';
import { PoReleaseOrderListComponent } from './RFQ/po-release-order-list/po-release-order-list.component';
import { ResubmissionComponent } from './components/reusable/resubmission/resubmission.component';
import { RfqExtensionComponent } from './RFQ/rfq-extension/rfq-extension.component';
import { RftModerationComponent } from './RFT/rft-moderation/rft-moderation.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { ResponseTemplateComponent } from './RFT/response-template/response-template.component';
import { EmployeeUserCreationComponent } from './components/milestone-completion/employee-user-creation/employee-user-creation.component';
import { PaymentComponent } from './components/reusable/payment/payment.component';
import { RftNewmoderatioComponent } from './RFT/rft-newmoderatio/rft-newmoderatio.component';
import { WorkOrderComponent } from './components/contracts/work-order/work-order.component';
import { WorkOrderListComponent } from './RFT/work-order-list/work-order-list.component';
import { ContractInsightsComponent } from './components/contracts/contract-insights/contract-insights.component';
import { RftModerationNewComponent } from './RFT/rft-moderation-new/rft-moderation-new.component';
import { CompartiviveEvaluationAnalysisComponent } from './RFT/compartivive-evaluation-analysis/compartivive-evaluation-analysis.component';
import { TimesheetComponent } from './components/contracts/timesheet/timesheet.component';
import { TimesheetBuyerComponent } from './components/milestone-completion/timesheet-buyer/timesheet-buyer.component';
import { FaqComponent } from './TF/faq/faq.component';
import { AdvanceShipmentNotesComponent } from './TF/advance-shipment-notes/advance-shipment-notes.component';
import { MyStockComponent } from './TF/my-stock/my-stock.component';
import { TrackTraceTransactionComponent } from './TF/track-trace-transaction/track-trace-transaction.component';
import { ParticipationAnalysisComponent } from './TF/participation-analysis/participation-analysis.component';
import { LastPurchasePriceComponent } from './TF/last_purchase_price/last_purchase_price.component';
import { InventoryInsightsComponent } from './TF/inventory-insights/inventory-insights.component';
import { InventoryItemMasterComponent } from './TF/inventory-item-master/inventory-item-master.component';
import { FaqAdminComponent } from './TF/faq-admin/faq-admin.component';
import { MyForecastComponent } from './workflow/my-forecast/my-forecast.component';
import { ForecastDemandAggregationComponent } from './workflow/forecast-demand-aggregation/forecast-demand-aggregation.component';
import { RftPostTenderQueriesComponent } from './RFT/rft-post-tender-queries/rft-post-tender-queries.component';
import { SupplierResponsePtcQueryComponent } from './RFT/supplier-response-ptc-query/supplier-response-ptc-query.component';
import { WorkflowUserSelectionComponent } from './workflow/workflow-user-selection/workflow-user-selection.component';
import { WorkflowBuilderComponent } from './workflow/workflow-builder/workflow-builder.component';
import { WorkflowBuilderDefinitionComponent } from './workflow/workflow-builder-definition/workflow-builder-definition.component';
import { WorkflowListsComponent } from './workflow/workflow-lists/workflow-lists.component';
import { RegisteredActivityComponent } from './components/supplier/registered-activity/registered-activity.component';
import { ExtendValidityComponent } from './RFT/extend-validity/extend-validity.component';
import { ExtendValiditySupplierComponent } from './RFT/extend-validity-supplier/extend-validity-supplier.component';
import { NewEntityAssignmentComponent } from './components/enhancement/new-entity-assignment/new-entity-assignment.component';
import { TabFormComponent } from './components/addon-services/table-forms/tab-form/tab-form.component';
import { FormPrimeComponent } from './components/addon-services/table-forms/form-prime/form-prime.component';
import { FormSub1Component } from './components/addon-services/table-forms/form-sub1/form-sub1.component';
import { FormSub2Component } from './components/addon-services/table-forms/form-sub2/form-sub2.component';
import { FormSimpleComponent } from './components/addon-services/table-forms/form-simple/form-simple.component';
import { InventoryItemListComponent } from './components/enhancement/inventory-item-list/inventory-item-list.component';
import { MaterialReceiptNoteComponent } from './components/enhancement/material-receipt-note/material-receipt-note.component';
import { MaterialRequisitionComponent } from './components/enhancement/material-requisition/material-requisition.component';
import { SystemItemMasterComponent } from './components/enhancement/system-item-master/system-item-master.component';
import { MaterialIssueNoteComponent } from './components/enhancement/material-issue-note/material-issue-note.component';
import { RequestRateChangeComponent } from './components/addon-services/service-request/request-rate-change/request-rate-change.component';
import { RequestPromotionComponent } from './components/addon-services/service-request/request-promotion/request-promotion.component';
import { RequestConsultantComponent } from './components/addon-services/service-request/request-consultant/request-consultant.component';
import { RequestBudgetReallocationComponent } from './components/addon-services/service-request/request-budget-reallocation/request-budget-reallocation.component';
import { RequestOvertimeAssignmentComponent } from './components/addon-services/service-request/request-overtime-assignment/request-overtime-assignment.component';
import { Form60Component } from './components/addon-services/form-60/form60/form60.component';
import { Form60PrimeConsultantComponent } from './components/addon-services/form-60/form60-prime-consultant/form60-prime-consultant.component';
//import { Form60SubConsultantComponent } from './components/addon-services/form-60/form60-Sub-Consultant/form60-Sub-Consultant.component';
import { Form60SummaryComponent } from './components/addon-services/form-60/form60-summary/form60-summary.component';
import { ProjectCompletionCertificateComponent } from './components/addon-services/project-completion-certificate/project-completion-certificate.component';
import { InvoiceProcessComponent } from './components/addon-services/invoice-process/invoice-process.component';
import { TransitDashboardComponent } from './components/addon-services/transit-dashboard/transit-dashboard.component';
import { TransitSearchComponent } from './components/addon-services/transit-search/transit-search.component';
import { Form60SearchComponent } from './components/addon-services/form60-search/form60-search.component';
import { PoSearchComponent } from './components/addon-services/po-search/po-search.component';
import { ProjectProgressSearchComponent } from './components/addon-services/project-progress-search/project-progress-search.component';
import { ProjectCompleteSearchComponent } from './components/addon-services/project-complete-search/project-complete-search.component';
import { InvoiceProcessSearchComponent } from './components/addon-services/invoice-process-search/invoice-process-search.component';
import { TransitContractCreationComponent } from './components/addon-services/transit-contract-creation/transit-contract-creation.component';
import { TransitPurchaseOrderComponent } from './components/addon-services/transit-purchase-order/transit-purchase-order.component';
import { ContractCreationTransitComponent } from './components/addon-services/contract-creation-transit/contract-creation-transit.component';
import { PoEditComponent } from './components/addon-services/po-edit/po-edit.component';
import { WorkflowTechnicalEvaluationComponent } from './components/workflow/workflow-technical-evaluation/workflow-technical-evaluation.component';
import { CsaReawardComponent } from './RFQ/csa-reaward/csa-reaward.component';
import { UserReassignmentComponent } from './components/reusable/user-reassignment/user-reassignment.component';
import { UserReassignmentListComponent } from './components/reusable/user-reassignment-list/user-reassignment-list.component';
import { RftInsightsUpdatedComponent } from './RFT/rft-insights-updated/rft-insights-updated.component';
import { InsightsAnalyticsComponent } from './components/addon-services/insights-analytics/insights-analytics.component';
import { InsightsLandingComponent } from './components/addon-services/insights-landing/insights-landing.component';
import { InsightsSupplierMgmtComponent } from './components/addon-services/insights-supplier-mgmt/insights-supplier-mgmt.component';
import { InsightsContractsMgmtComponent } from './components/addon-services/insights-contracts-mgmt/insights-contracts-mgmt.component';
import { InsightsOrderMgmtComponent } from './components/addon-services/insights-order-mgmt/insights-order-mgmt.component';
import { InsightsWccMgmtComponent } from './components/addon-services/insights-wcc-mgmt/insights-wcc-mgmt.component';
import { LandingNewComponent } from './components/landing-new/landing-new.component';
import { LandingLoginComponent } from './components/landing-login/landing-login.component';
import { DashboardOrdersComponent } from './components/dashboard-orders/dashboard-orders.component';
import { InsightSourcingMgmtComponent } from './components/addon-services/insight-sourcing-mgmt/insight-sourcing-mgmt.component';
const routes: Routes = [
  {
    path: '', component: Landing1Component,
    canActivate: [SessionGuard]
  },
  {
    path: 'login',
    component: Login1Component,
    canActivate: [SessionGuard]
  },

  {

    path: 'create-new-registration',
    component: CreateNewRegistrationComponent,
    canActivate: [SessionGuard]
  },
  {

    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [SessionGuard]
  },
  {

    path: 'user-activate-alert',
    component: UserActivateAlertComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [SessionGuard]
  },
  {
    path: 'view-tender-details',
    component: TenderDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-public-tenders',
    component: ViewPublicTendersComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'landing1',
    component: LandingComponent,
    canActivate: [SessionGuard]
  },
  {
    path: 'landing',
    component: Landing1Component,
    canActivate: [SessionGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: 'landing',
      //   component: LandingComponent,
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {

        path: 'journey-hub',
        component: JourneyhubComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-info',
        component: SupplierInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-list',
        component: SupplierTerminationListComponent,
        canActivate: [AuthGuard, RoleGuard]
      },
      {
        path: 'supplier-termination-process',
        component: SupplierTerminationProcessComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'customer-dashboard',
        component: CustomerDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard-manage-contracts',
        component: DashboardManageContractsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ecommerce-dashboard',
        component: DashboardProductComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard-workcompletion',
        component: DashboardWorkcompletionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-creation',
        component: ContractCreationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-view',
        component: ContractCreationViewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'compare-contracts',
        component: CompareContractsComponent,
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'contract-creation',
      //   component: ContractCreationComponent,
      //   canActivate: [AuthGuardService]
      // },
      {
        path: 'tenders-dashboard',
        component: DashboardTendersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'order-management-dashboard',
        component: DashboardOrdersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tender-opening-auction',
        component: TenderOpeningAuctionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'queries-notification',
        component: QueriesNotificationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'update-profile',
        component: UpdateProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
      },


      {
        path: 'supplier-information',
        component: SupplierInformationComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'supplier-prequalification',
        component: SupplierPrequalificationComponent,
        canActivate: [AuthGuard, RoleGuard]
      },
      {
        path: 'company-score-card',
        component: CompanyScoreCardComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierPreQualification" }
      },
      {
        path: 'supplier-score-card-summary',
        component: SupplierScoreCardSummaryComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierPreQualification" }
      },
      {
        path: 'tender-details',
        component: TenderDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'public-tender-details',
        component: PublicTenderDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tender-search',
        component: TenderSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'limited-tender-search',
        component: LimitedTenderSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-address-details',
        component: SupplierAddressDetailsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'supplier-contact-details',
        component: SupplierContactDetailsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'supplier-financial-business',
        component: SupplierFinancialBusinessComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'supplier-bank-details',
        component: SupplierBankDetailsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'supplier-category-scope',
        component: SupplierCategoryScopeComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'attachment-section',
        component: AttachmentDetailsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'final-view',
        component: FinalViewComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'contactus',
        component: ContactusComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'performance-dashboard',
        component: DashboardPerformanceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard-contacts',
        component: DashboardContactsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard-contract-mgt-system',
        component: DashboardContractMgtSystemComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'entity-assignment',
        component: SupplierEntityAssignmentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'add-entity-assignment',
        component: AddentityassignmentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'customer-vendor-collabration',
        component: CustomerVendorCollabrationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-search',
        component: ContractSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-search/:slug',
        component: ContractSearchComponent,
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'contract-creation',
      //   component: ContractCreationComponent,
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'claim-search',
        component: ClaimSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoice-contract-search',
        component: InvoiceContractSearchComponent,
        canActivate: [AuthGuard]
      },
      /*  {
         path: 'invoice-view',
         component: InvoiceViewComponent,
         canActivate: [AuthGuard]
       }, */
      {
        path: 'variation-order-search',
        component: VariationOrderSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'milestone-completion',
        component: CompletionCertificateSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'milestone-completion-review',
        component: CompletionCertificateSearchBuyerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'preview',
        component: PreviewComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'payment',
        component: InvoiceSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-payment',
        component: InvoiceSearchBuyerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoice-details',
        component: InvoiceDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'inner-dashboard',
        component: InnerDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notification',
        component: NotificationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'workflow',
        component: WorkflowListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-information',
        component: ContractInformationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-info-add',
        component: SupplierInfoAddComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-info-edit/:applicationno',
        component: SupplierInfoEditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-edit',
        component: ContractEditComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'template-repository',
        component: TemplateRepositoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'claim-edit',
        component: ClaimEditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'validation-order-details',
        component: ValidationOrderDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'milestone-completion-details',
        component: MilestoneCompletionDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'milestone-completion-view',
        component: MilestoneCompletionViewComponent,
        canActivate: [AuthGuard, RoleGuard]
      },
      {
        path: 'milestone-completion-search',
        component: MilestoneCompletionSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'public-tenders',
        component: PublicTendersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'limited-tenders',
        component: LimitedTendersComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'rfi',
        component: RfiComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'auction-detail-online',
        component: AuctionDetailOnlineComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'auction-participant',
        component: AuctionParticipantComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rfi-search',
        component: RfiSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rfi-details',
        component: RfiDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'request-quotation',
        component: RequestQuotationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'catalogue-list',
        component: CatalogueListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product-list',
        component: ProductListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'catalogue-search',
        component: SearchProductComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product-master',
        component: ProductMasterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'catalogue',
        component: CatalogueMasterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rfq-response',
        component: RfqResponseComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'evaluation-creation',
        component: EvaluationCreationComponent,
        canActivate: [AuthGuard]
      }, {
        // path: 'evaluation-list',
        path: 'performance-list',
        component: EvaluationListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'performance-response',
        component: PerformanceSupplierResponseComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'performance-buyer-review',
        component: PerformanceBuyerReviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'performance-list1',
        component: PerformanceEvalListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'performance-reviewed-list',
        component: PerformanceProcureHeadResponsesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'comparative-quotation',
        component: ComparativeQuotationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'csa-reAward',
        component: CsaReawardComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'auction',
        component: AuctionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'auction-details',
        component: AuctionDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'temp-create',
        component: TempCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'linking-contract',
        component: LinkingContractComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'link-temp-contract',
        component: LinkTempContractComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'text-editor',
        component: TextEditorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'post-queries',
        component: PostQueriesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'published-notifications-detail',
        component: PublishedNotificationsDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tender-submission',
        component: TenderSubmissionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'queries-submitted',
        component: QueriesSubmittedComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'consolidated-questions-answer',
        component: ConsolidatedQuestionsAnswerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-claim',
        component: CreateClaimComponent,
        canActivate: [AuthGuard]
      }, {
        path: 'claim-contract-search',
        component: ClaimsContractSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-invoice',
        component: CreateInvoiceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoice-view',
        component: CreateInvoiceViewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-registration-preview-page',
        component: SupplierRegistrationPreviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-repository',
        component: ContractCreationRepositoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'request-for-tender',
        component: RequestForTendersInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pre-requisites',
        component: PreRequisitesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'response-template',
        component: ResponseTemplateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-assignment',
        component: SupplierAssignmentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-doc-set',
        component: RftDocSetComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'response-doc-set',
        component: ResponseDocSetComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'queries-clarifications',
        component: QueriesClarificationsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-actions',
        component: RftActionsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-evaluation',
        component: RftEvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pr-details',
        component: PrDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'evaluation-definition',
        component: EvaluationDefinitionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-publish',
        component: RftPublishComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-search',
        component: RftInsightSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-insights',
        component: RftInsightsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-tenderopentype',
        component: RftTenderopenTypeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-tenderopeningSearch',
        component: RftTenderopeningsearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tender-view',
        component: TenderViewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'download-rfp',
        component: DownloadRfpComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-notification',
        component: RftNotificationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'technical-participants',
        component: TechnicalParticipantsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'commercial-participants',
        component: CommercialParticipantsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'claim-info',
        component: ClaimInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pq-questionnaire',
        component: PqQuestionnaireComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { moduleName: "supplierRegistration" }
      },
      {
        path: 'notification-requests',
        component: NotificationRequestsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-cancellation',
        component: ContractCancellationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'po-cancellation',
        component: PoCancellationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-cancellation',
        component: RftCancellationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notification-list',
        component: NotificationListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'purchase-order',
        component: PurchaseOrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'purchase-releaseOrder',
        component: PoReleaseOrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shipment-tracking',
        component: ShipmentTrackingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shipment-details',
        component: ShipmentDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shipment-summary',
        component: ShipmentSummaryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shipment-bill-details',
        component: ShipmentBillDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rfq-list',
        component: RfqListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'po-list',
        component: PoListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'po-releaseOrder-list',
        component: PoReleaseOrderListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'impl-details',
        component: SysAdminConfigComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard-invoice',
        component: DashboardInvoicesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-dashboard',
        component: SupplierDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'work-order',
        component: WorkOrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'work-order-list',
        component: WorkOrderListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'view-rfq',
        component: ViewRfqComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'view-rft',
        component: ViewRftComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'publish-ptc',
        component: RftPostTenderQueriesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-query-response',
        component: SupplierResponsePtcQueryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'view-query-response',
        component: SupplierResponsePtcQueryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-extension',
        component: RftExtensionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-review',
        component: RftReviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rft-moderation',
        component: RftModerationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'extend-validity',
        component: ExtendValidityComponent
      },
      {
        path: 'extend-validity-supplier',
        component: ExtendValiditySupplierComponent
      },
      {
        path: 'transit-dashboard',
        component: TransitDashboardComponent
      },
      {
        path: 'transit-search',
        component: TransitSearchComponent
      },
      {
        path: 'form60-search',
        component: Form60SearchComponent
      },
      {
        path: 'po-search',
        component: PoSearchComponent
      },
      {
        path: 'project-progress-search',
        component: ProjectProgressSearchComponent
      },
      {
        path: 'project-complete-search',
        component: ProjectCompleteSearchComponent
      },
      {
        path: 'invoice-process-search',
        component: InvoiceProcessSearchComponent
      },
      {
        path: 'landing-new',
        component: LandingNewComponent
      },
      {
        path: 'transit-contract-creation',
        component: TransitContractCreationComponent
      },
      {
        path: 'transit-purchase-order',
        component: TransitPurchaseOrderComponent
      },
      {
        path: 'contract-creation-transit',
        component: ContractCreationTransitComponent
      },
      {
        path: 'po-edit',
        component: PoEditComponent
      },

      // {
      //   path: 'rft-new-moderation',
      //   component: RftNewmoderatioComponent,
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'rft-new-moderation',
        component: RftModerationNewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'comparitiveEvaluationAnalysis',
        component: CompartiviveEvaluationAnalysisComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'view-analytics',
        component: InsightsLandingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'supplier-addition',
        component: SupplierAdditionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'resubmission',
        component: ResubmissionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rfq-extension',
        component: RfqExtensionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userManual',
        component: UserManualComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'employee-creation',
        component: EmployeeUserCreationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payment-gateway',
        component: PaymentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contract-insights',
        component: ContractInsightsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'time-sheet',
        component: TimesheetComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'view-time-sheet',
        component: TimesheetBuyerComponent,
      },
      {
        path: 'tab-form',
        component: TabFormComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'new-entity-assignment',
        component: NewEntityAssignmentComponent,
      },
      {
        path: 'inventory-insights',
        component: InventoryInsightsComponent,
      },
      {
        path: 'inventory-item-list',
        component: InventoryItemListComponent,
      },
      {
        path: 'system-item-master',
        component: SystemItemMasterComponent,
      },
      {
        path: 'inventory-item-master',
        component: SystemItemMasterComponent,
      },
      {
        path: 'material-receipt-note',
        component: MaterialReceiptNoteComponent,
      },
      {
        path: 'material-requisition',
        component: MaterialRequisitionComponent,
      },
      {
        path: 'inventory-item-master',
        component: InventoryItemMasterComponent,
      },
      {
        path: 'advance-shipment-notes',
        component: AdvanceShipmentNotesComponent,
      },
      {
        path: 'my-stock',
        component: MyStockComponent,
      },
      {
        path: 'material-issue-note',
        component: MaterialIssueNoteComponent,
      },
      {
        path: 'participation-analysis',
        component: ParticipationAnalysisComponent,
      },
      {
        path: 'track-trace-transaction',
        component: TrackTraceTransactionComponent,
      },
      {
        path: 'faq-admin',
        component: FaqAdminComponent,
      },
      {
        path: 'my-forecast',
        component: MyForecastComponent,
      },
      {
        path: 'forecast-demand-aggregation',
        component: ForecastDemandAggregationComponent,
      },
      {
        path: 'workflow-lists',
        component: WorkflowListsComponent,
      },
      {
        path: 'workflow-builder',
        component: WorkflowBuilderComponent,
      },
      {
        path: 'workflow-builder-definition',
        component: WorkflowBuilderDefinitionComponent,
      },
      {
        path: 'last-purchase-price',
        component: LastPurchasePriceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'registered-activity',
        component: RegisteredActivityComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'request-rate-change',
        component: RequestRateChangeComponent,
      },
      {
        path: 'request-promotion',
        component: RequestPromotionComponent,
      },
      {
        path: 'request-consultant',
        component: RequestConsultantComponent,
      },
      {
        path: 'request-budget-reallocation',
        component: RequestBudgetReallocationComponent,
      },
      {
        path: 'request-overtime-assignment',
        component: RequestOvertimeAssignmentComponent,
      },
      {
        path: 'form60',
        component: Form60Component,
      },
      {
        path: 'form60-prime-consultant',
        component: Form60PrimeConsultantComponent,
      },
      // {
      //   path: 'form60-Sub-Consultant',
      //   component: Form60SubConsultantComponent,
      // },
      {
        path: 'form60-summary',
        component: Form60SummaryComponent,
      },
      {
        path: 'invoice-process',
        component: InvoiceProcessComponent,
      },
      {
        path: 'project-completion-certificate',
        component: ProjectCompletionCertificateComponent,
      },
      {
        path: 'rft-insights-updated',
        component: RftInsightsUpdatedComponent,
      },
     
      {
        path: 'insights-analytics',
        component: InsightsAnalyticsComponent,
        
      },
      {
        path: 'insights-landing',
        component: InsightsLandingComponent,
        
      },
      {
        path: 'insight-sourcing-mgmt',
        component: InsightSourcingMgmtComponent,
        
      },
      {
        path: 'insights-supplier-mgmt',
        component: InsightsSupplierMgmtComponent,
        
      },
      {
        path: 'insights-order-mgmt',
        component: InsightsOrderMgmtComponent,
        
      },
      {
        path: 'insights-wcc-mgmt',
        component: InsightsWccMgmtComponent,
        
      },
      {
        path: 'insights-contracts-mgmt',
        component: InsightsContractsMgmtComponent,
        
      },
      {
        path: 'wf-technical-evaluation',
        component: WorkflowTechnicalEvaluationComponent,
      },
      {
        path: 'user-reassignment',
        component: UserReassignmentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'user-reassignment-list',
        component: UserReassignmentListComponent,
        canActivate: [AuthGuard]
      },

      // {
      //   path: '**',
      //   pathMatch   : 'full',
      //   resolve: {
      //     path: PathResolveService
      //   },
      //   component: NotFoundComponent
      // }

    ]
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'login' }

];

// @NgModule({
//   imports: [RouterModule.forRoot(routes, { useHash: true })],
//   // imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

export const AppRoutingModule = RouterModule.forRoot(routes, { useHash: false });

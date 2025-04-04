export class WorkFlowScreenConstants{
    static readonly PREQUALIFICATION = 'Pre-Qualification';
    static readonly SUPPLIERTERSUS = 'Supplier Termination/Suspension';
    static readonly PR = 'Purchase Requisition';
    static readonly SUPPLIERREVOKE = 'Supplier Revoke'
}

export class WorkFlowStatusConstants{
    static readonly WFINITIATED = 'WF-Initiated';
    static readonly WFREQINFO = 'WF-Req Info';
    static readonly WFAPPROVED = 'WF-Approved';
    static readonly WFREJECTED = 'WF-Rejected';
}

export class WorkFlowStatusForLevelWise{
    static readonly LEVELAPPROVED = 'Approved';
    static readonly LEVELREJECTED = 'Rejected';
    static readonly LEVELPENDING = 'Pending';
    static readonly LEVELREQFORINFO = 'Request For Information';
}

export class ActivityScreenConstants{
    static readonly SupplierPreQualificationActivity = 'Supplier Pre-Qualification Activity';
    static readonly SupplierTerminationActivity = 'Supplier Termination Activity';
    static readonly SupplierRevoke = 'Supplier Revoke';
}
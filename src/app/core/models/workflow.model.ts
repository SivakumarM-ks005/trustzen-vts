
export class ApprovalWorkFlow {
    workFlowId: number;
    primaryKeyId: number;
    keyName: string;
    workFlowName: string;
    participantType: string;
    assignedUser: string;
    actionDate: any;
    actionTaken: string;
    comments: string;
}

export class SaveWorkFlow {
    workFlowId: number;
    primaryKeyId: number;
    workFlowName: string;
    actionTaken: string;
    comments?: string;
    userId: number;
}
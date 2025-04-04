export class LicenseActivityDto {
    licensedActivityId: number = 0;
    activityId: number;
    subActivityId: number;
    activityName: string;
    subActivityName: string;
    supplierId: number;
    userId: number;
    isChangedFlag: boolean = false;
  }
  
  export class ActivityVm {
    activityId: number;
    activity: string;
  }
  export class SubActivityVm {
    subActivityId: number;
    subActivity: string;
  }
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

type SharedSubject<T> = {
  sharedId: string;
  sharedType?: string;
  sharedName?: string;
  sharedData?: T;
  otherInfo?: string
};
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private storedValue = signal<storedActionSignal>({ componentName: "", action: "", data: {} });
  private rfqResponseRef = signal<string>("");
  constructor() { }

  setActionValue(data: any) {
    this.storedValue.set({
      componentName: data?.componentName,
      action: data?.action,
      data: data?.valObject
    })
  }
  supscriptionLookup: { [key in string]: Subscription } = {};
  getActionValue() {
    return this.storedValue();
  }
  private sharedSubject = new BehaviorSubject<SharedSubject<any>>({ sharedId: 'no data' }); // Holds the shared data

  // constructor() { }
  // Method to update the shared data
  setData(data: SharedSubject<any>): void {
    this.sharedSubject.next(data);
  }

  // Method to get the shared data as an Observable
  getData(): Observable<SharedSubject<any>> {
    return this.sharedSubject.asObservable();
  }
  calculateFileSize(filesize: number): string {
    const sizeInKB = filesize / 1024; // Convert bytes to KB
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(2)} KB`; // Show in KB
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`; // Convert KB to MB if > 1024 KB
    }
  }

  //Get RFQ Response ref
  setRefValue(value:string){
    this.rfqResponseRef.set(value);
  }

  getRefValue(){
    return this.rfqResponseRef();
  }

  clearRefValue(){
    this.rfqResponseRef.set("");
  }
}


export interface storedActionSignal { componentName: string, action: string, data: {} }

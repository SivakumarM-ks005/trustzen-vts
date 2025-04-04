import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequisitionService {
  API_URL: string;
  APIADMIN_URL: string
  constructor(private http: HttpClient) {
    this.API_URL = environment.apiSourceUrl;
    this.APIADMIN_URL = environment.apiadminUrl;
  }

  //Get dropdown LOV's
  getDropdownDatas(): Observable<any> {
    const dataUrl = `${this.API_URL}Common/GetMatReqDropDownData`;
    return this.http.get<any>(dataUrl);
  }

  //Save method
  saveMaterialReq(element:FormData): Observable<any>{
    const dataUrl = `${this.API_URL}Sourcing/SaveMaterialRequisition`;
    return this.http.post<any>(dataUrl, element);
  }

  //Get all Create Material List
  getAllCreatedList(): Observable<any>{
    const dataUrl = `${this.API_URL}Sourcing/GetMaterialRequisitionList`;
    return this.http.get<any>(dataUrl);
  }
}

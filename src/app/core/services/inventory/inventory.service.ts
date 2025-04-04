import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
apiUrl = environment.apiUrl;
apiAdminUrl = environment.apiadminUrl;
  constructor(private http: HttpClient) { }

  // Get item status list
  getItemStatusList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetItemStatusList`;
    return this.http.get<any>(dataUrl);
  }

  // Get item type list
  getItemTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetItemTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get costing method type list
  getCostingMethodTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetCostingMethodTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get unit of measure type list
  getUnitMeasureTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetUnitOfMeasureTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get store location type list
  getStoreLocationTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetStoreLocationTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get shelf file type list
  getShelfFileTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetShelflifeTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get shelf aisel bin type list
  getShelfAiselBinTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetShelfAiselBinTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get Zone type list
  getZoneTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetZoneTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get climate storage type list 
  getClimateStorageTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetClimateStorageTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get secured storage type list
  getSecuredStorageTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetSecuredStorageTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get Category Type List
  getCategoryTypeList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetCategoryTypeList`;
    return this.http.get<any>(dataUrl);
  }

  // Get Sub Category type list
  getSubCategoryTypeList(catId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetSubCategoryTypeList/${catId}`;
    return this.http.get<any>(dataUrl);
  }

  // Get all saved inventory list
  getSavedInventoryList(): Observable<any> {
    const dataUrl = `${this.apiUrl}Inventry/GetAllItemMasterDetails`;
    return this.http.get<any>(dataUrl);
  }

  // Save Inventory
  saveInventory(element:any): Observable<any>{
    const dataUrl = this.apiUrl + "Inventry/SaveItemMaster";
    return this.http.post<any>(dataUrl, element);
  }

  //Get Supplier Management
  GetSupplierManagement(): Observable<any> {
    const dataUrl = `${this.apiAdminUrl}SysParamSupplierManagement/GetSupplierManagement`;
    return this.http.get<any>(dataUrl);
  }

  //Get All Inventory List
  getAllInventoryList(){
    const dataUrl = `${this.apiUrl}Inventry/GetAllItemMasterDetails`;
    return this.http.get<any>(dataUrl);
  }

  // Get Inventory Assign entity
  getStoredAssignEntity(id:number){
    const dataUrl = `${this.apiUrl}Inventry/GetInventryAssignEntityResponse?ItemHeaderId=${id}`;
    return this.http.get<any>(dataUrl);
  }

  //Save Inventory assign entity
  saveInventoryAssignEntity(list:any, id:number): Observable<any>{
    const dataUrl = `${this.apiUrl}Inventry/SaveOrUpdateInventryAssignEntitiesResponse?ItemHeaderId=${id}`;
    return this.http.post<any>(dataUrl, list)
  }

  //Get Code Description List
  getCodeDescList(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}Inventry/GetCodeDescriptionList`);
  }

  //Get Parent Category List
  getParentCategoryList(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}Inventry/GetParentCategoryList`);
  }

  //Get Sub Category List
  getSubCategoryList(pId:number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}Inventry/GetSubCategoryList/${pId}`);
  }

  //Get child Category List
  getChildCategoryList(sId:number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}Inventry/GetChildCategoryList/${sId}`);
  }

  getAdminAttributes(): Observable<any>{
    return this.http.get<any>(`${this.apiAdminUrl}InventoryManagement/GetInventoryManagement`);
  }

}

import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ClauseTemplateDropDownList, ContractTemplate, templateCategoryTransDto, TemplateEntityTransDto, templateWorkflowDetailDto, templateWorkflowDto } from "../models/contract-template.model";
import { CommonService } from "../services/common.service";
import { ClauseLibraryDropDownList, ClauseLibrary } from "../models/contract-clause.model";

@Injectable({
    providedIn: 'root',
})
export class ContractService {
    apiUrl: string;
    constructor(private http: HttpClient, private commonService: CommonService) {
        this.apiUrl = this.commonService.getConfig('apiUrl');

    }

    getClauseDropDownTypes(): Observable<ClauseLibraryDropDownList> {
        const dataUrl = `${this.apiUrl}Contract/GetClauseDropDownList`;
        return this.http.get<ClauseLibraryDropDownList>(dataUrl);
    }
    getClauseLibraryList(): Observable<ClauseLibrary[]> {
        const dataUrl = `${this.apiUrl}Contract/GetClauseLibraryList`;
        return this.http.get<ClauseLibrary[]>(dataUrl);
    }
    saveClauseLibrary(clauseLibrary: ClauseLibrary) {
        let dataURL = `${this.apiUrl}Contract/SaveClauseLibrary`;
        return this.http.post(dataURL, clauseLibrary);
    }

    deleteOrUndoClauseLibrary(clauseId: number, deleteFlag: boolean, userId: number) {
        const dataUrl = `${this.apiUrl}Contract/DeleteOrUndoClauseLibrary`;
        let body = {};
        let params = new HttpParams({
            fromObject: {
                'clauseId': `${clauseId}`,
                'deleteFlag': `${deleteFlag}`,
                'userId': `${userId}`
            }
        });
        return this.http.put(dataUrl, body, { params: params });
    }

    deActivateClauseLibrary(clauseId: number) {
        const dataUrl = `${this.apiUrl}Contract/DeActivateClauseLibrary`;
        let body = {};
        let params = new HttpParams({
            fromObject: {
                'clauseId': `${clauseId}`
            }
        });
        return this.http.put(dataUrl, body, { params: params });
    }

    getTemplateDropDownList(): Observable<ClauseTemplateDropDownList> {
        const dataUrl = `${this.apiUrl}Contract/GetClauseTemplateDropDownList`;
        return this.http.get<ClauseTemplateDropDownList>(dataUrl);
    }
    getClauseTemplateList(): Observable<ContractTemplate[]> {
        const dataUrl = `${this.apiUrl}Contract/GetClauseTemplateList`;
        return this.http.get<ContractTemplate[]>(dataUrl);
    }
    saveClauseTemplate(templateData: ContractTemplate) {
        let dataURL = `${this.apiUrl}Contract/SaveClauseTemplate`;
        return this.http.post<ContractTemplate>(dataURL, templateData);
    }

    deleteOrUndoClauseTemplate(templateId: number, deleteFlag: boolean, userId: number) {
        const dataUrl = `${this.apiUrl}Contract/DeleteOrUndoClauseTemplate`;
        let body = {};
        let params = new HttpParams({
            fromObject: {
                'templateId': `${templateId}`,
                'deleteFlag': `${deleteFlag}`,
                'userId': `${userId}`
            }
        });
        return this.http.put(dataUrl, body, { params: params });
    }

    deActivateClauseTemplate(templateId: number) {
        const dataUrl = `${this.apiUrl}Contract/DeActivateClauseTemplate`;
        let body = {};
        let params = new HttpParams({
            fromObject: {
                'templateId': `${templateId}`
            }
        });
        return this.http.put(dataUrl, body, { params: params });
    }

    updateTemplateStatus(templateId: number, status: string) {
        const dataUrl = `${this.apiUrl}Contract/UpdateTemplateStatus`;
        let body = {};
        let params = new HttpParams({
            fromObject: {
                'templateId': `${templateId}`,
                'status': `${status}`,
            }
        });
        return this.http.put(dataUrl, body, { params: params });
    }
    saveTemplateWorkFlow(wfData: templateWorkflowDto) {
        let dataURL = `${this.apiUrl}Contract/SaveTemplateWorkFlow`;
        return this.http.post(dataURL, wfData);
    }
    getTemplateWorkFlowHistory(templateId: number, userId: number) {
        const dataUrl = `${this.apiUrl}Contract/GetTemplateWorkflowHistory`;
        let params = new HttpParams({
            fromObject: {
                'templateId': `${templateId}`,
                'userId': `${userId}`,
            }
        });
        return this.http.get<templateWorkflowDetailDto[]>(dataUrl, { params: params });
    }

    saveTemplateCategory(categoryData: templateCategoryTransDto) {
        let dataURL = `${this.apiUrl}Contract/SaveTemplateCategory`;
        return this.http.post(dataURL, categoryData);
    }

    getTemplateCategory(templateId: number) {
        const dataUrl = `${this.apiUrl}Contract/GetTemplateCategory`;
        let params = new HttpParams({
            fromObject: {
                'templateId': `${templateId}`
            }
        });
        return this.http.get<templateCategoryTransDto>(dataUrl, { params: params });
    }

    saveTemplateEntity(entityData: TemplateEntityTransDto[]) {
        let dataURL = `${this.apiUrl}Contract/SaveTemplateEntity`;
        return this.http.post(dataURL, entityData);
    }

    getTemplateEntity(templateId: number) {
        const dataUrl = `${this.apiUrl}Contract/GetTemplateEntity`;
        let params = new HttpParams({
            fromObject: {
                'templateId': `${templateId}`
            }
        });
        return this.http.get<TemplateEntityTransDto[]>(dataUrl, { params: params });
    }
}

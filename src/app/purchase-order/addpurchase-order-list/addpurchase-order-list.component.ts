import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-addpurchase-order-list',
  standalone: true,
  imports: [AngularEditorModule,ReactiveFormsModule , MatCheckboxModule, MatFormFieldModule, MatButtonModule, MatFormField, MatTooltipModule, MatIconButton, MatLabel,MatSelectModule, MatButtonModule, MatInputModule, MatDatepickerModule,  ], 
  templateUrl: './addpurchase-order-list.component.html',
  styleUrl: './addpurchase-order-list.component.scss'
})
export class AddpurchaseOrderListComponent implements OnInit {
  constructor(private fb:FormBuilder){
    console.log('AddpurchaseOrderListComponent constructor called');
  }
  PO_Form:FormGroup;

  ngOnInit(): void {
    this.createPO();
    console.log(this.PO_Form,'poform')
  }
  createPO(){
   this.PO_Form = this.fb.group({
    BOQ: this.fb.group({
      functionalCurrency: ['', Validators.required],
      transactionalCurrency: ['', Validators.required],
       items: this.fb.array([this.addItems()]), // Dynamic array for items inside BOQ
       totItemsValue:['0'],
       totDiscountValue:['0'],
       totDiscountMode:['0'],
       netValue:['0'],
       totTaxMode:[''],
       totTaxValue:[''],
       incoTerms:[''],
       totValue:[''],

      }),
    entityLevel:this.fb.group({
      entityName: ['', Validators.required],
      level1: ['', Validators.required],
      level2: ['', Validators.required],
      level3: ['', Validators.required],
      level4: ['', Validators.required]
    }),
    PO_header: this.fb.group({
      source: ['', Validators.required],
      poRef: [''],
      createdDate: [''],
      poCreatedBy: ['', Validators.required],
      poCurrency: ['', Validators.required],
      poValue: ['', Validators.required],
      supplierName: ['', Validators.required],
      quotationRef: ['', Validators.required],
      quotationDate: [''],
      purchaseType: ['', Validators.required],
      purchaseOrderType: ['', Validators.required],
      purchaseClassification: [''],
      spendType: ['', Validators.required],
      sourcingType: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      shortName: [''],
      description: [''],
      contractRef: ['', Validators.required],
      contractCreationDate: ['', Validators.required],
      paymentTerms: ['', Validators.required]
    }),
    personalisationSetup:this.fb.group({
      itemLevelDiscount: [true],
      itemLevelTax: [false],
      incoOtherCost: [true],
      forExCurrencyTxn: [true],
      withholdTaxApplicable: [false],
      changeItemShipToSite: [true],
      changeItemNeedByDate: [true]
    }),
    supplierDetails:this.fb.group({
      siteId: ['SI-304'],
      siteName: ['ABCD & CO'],
      supplierName: ['Shell Oil'],
      commercialLicense: ['265326'],
      taxRegistrationNumber: ['625324326'],
      addressLine1: ['No:161, Periyaar Road, Hastinapuram'],
      country: ['India'],
      state: ['Tamilnadu'],
      city: ['Chennai'],
      email: ['admin@kryasolutions.com'],
      phone: ['+91 98401 98401']
    }),
    milestones: this.fb.array([this.milestoneGrp()]),
    shippingInformation: this.fb.group({
      shippingMethod: ['', Validators.required],
      shippingTerm: ['', Validators.required],
      description: ['', Validators.required],
      negotiable: [false]
    }),
    otherTerms:[''],
      billToAddressLine1: ['', Validators.required],
      billToAddressLine2: [''],
      billToCountry: ['', Validators.required],
      billToState: ['', Validators.required],
      billToCity: ['', Validators.required],
      billToPostalCode: ['', Validators.required],
      sameAsBillTo: [false],
      shipToAddressLine1: ['', Validators.required],
      shipToAddressLine2: [''],
      shipToCountry: ['', Validators.required],
      shipToState: ['', Validators.required],
      shipToCity: ['', Validators.required],
      shipToPostalCode: ['', Validators.required]
   });
   
  }
  addItems(data?:any){
    const itemFormGroup = this.fb.group({
      code: [data?.code || '', Validators.required],
      description: [data?.description || '', Validators.required],
      uom: [data?.uom || '', Validators.required],
      quantity: [data?.quantity || '', Validators.required],
      shipToSite: [data?.shipToSite || '', Validators.required],
      needByDate: [data?.needByDate || '', Validators.required],
      deliveryDate: [data?.deliveryDate || '', Validators.required],
      unitRate: [data?.unitRate || '', Validators.required],
      itemValue: [data?.itemValue || '', Validators.required],
      discountMode: [data?.discountMode || '', Validators.required],
      discountRate: [data?.discountRate || '', Validators.required],
      discountValue: [data?.discountValue || '', Validators.required],
      taxMode: [data?.taxMode || '', Validators.required],
      taxRate: [data?.taxRate || '', Validators.required],
      taxValue: [data?.taxValue || '', Validators.required]
    });
    return itemFormGroup;
  }

  //BOQ SECTION
  getItems():any{
    return this.PO_Form.get('BOQ.items') as FormArray;
  }
  //BOQ SECTION

  //Milestone section
  milestoneGrp(data?: any): FormGroup {
    return this.fb.group({
      description: [data?.description || '', Validators.required],
      milestoneDescription: [data?.milestoneDescription || '', Validators.required],
      fixedValue: [data?.fixedValue || '', Validators.required],
      value: [data?.value || '', Validators.required],
      expandedValue: [data?.expandedValue || '', Validators.required],
      allowPartFulfillment: [data?.allowPartFulfillment || false],
      billable: [data?.billable || false],
      advancePayable: [data?.advancePayable || false],
      reserveFund: [data?.reserveFund || false],
      completionDate: [data?.completionDate || '', Validators.required],
      milestoneStatus: [data?.milestoneStatus || 'Pending']
    });
  }
    // Add a new milestone to the array
    addMilestone() {
      this.getMilestones().push(this.milestoneGrp());
    }
  
    // Remove a milestone from the array
    removeMilestone(index: number) {
      this.getMilestones().removeAt(index);
    }
  getMilestones(): any {
    return this.PO_Form.get('milestones') as FormArray;
  }
  //Milestone section

  htmlContent = '';
  config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '8rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [
        ['bold']
      ],
      customClasses: [
        {
          name: "quote",
          class: "quote",
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: "titleText",
          class: "titleText",
          tag: "h1",
        },
      ]
    };
    getSupplierDetails(key:string){

     return this.PO_Form.get(`supplierDetails.${key}`)?.value;
    }
}

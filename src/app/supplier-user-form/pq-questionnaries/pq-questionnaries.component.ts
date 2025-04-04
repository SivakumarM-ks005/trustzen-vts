import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { CommonService } from '../../core/services/common.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { AdminService } from '../../core/services/admin/admin.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatFormField, MatSuffix, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-pq-questionnaries',
  templateUrl: './pq-questionnaries.component.html',
  styleUrl: './pq-questionnaries.component.scss',
  standalone: true,
  imports: [MatTooltipModule, FormsModule, ReactiveFormsModule, NgFor, NgClass, MatExpansionModule, NgIf, MatFormField, MatInput, MatCheckbox, MatRadioGroup, MatRadioButton, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatIcon, MatBadge, MatLabel]
})
export class PqQuestionnariesComponent implements OnInit {

  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  previousTabClick: boolean = false;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];
  @Output() tabValidCheckEmit = new EventEmitter();
  @Input() supplierId: number;
  formPQuestions: FormGroup;
  pqquestionnaries: any;
  showPopup = false;
  popupImage: SafeResourceUrl | null = null;
  questionAnswer: any;
  attachToggle: { [key: string]: boolean } = {};
  childattachToggle: { [key: string]: boolean } = {};
  isOpen: boolean = true;
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() NextFlag = new EventEmitter<boolean>();

  constructor(
    public complianceCheckService: ComplianceCheckService,
    public commonService: CommonService,
    public fb: FormBuilder,
    public adminService: AdminService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    public supplierUserFormService: SupplierUserFormService,
    private SupplierUserForm: SupplierUserFormService,
    public activateRouter: ActivatedRoute
  ) {
    this.formPQuestions = this.fb.group({
      supplierClassification: [''],
      country: [''],
      Status: [''],
      sections: this.fb.array([]) // Initialize the sections array dynamically
    });
  }

  // pqQuestionnariesList(){
  //   this.commonService.getpqQuestionnariesList().subscribe((res) => {
  //     if (res) {
  //       // this.countryList = res;
  //     }
  //   })
  // }

  ngOnInit(): void {

    this.activateRouter?.params?.subscribe((response) => {

      if (response.status === 'In-Progress') {
        this.formPQuestions.disable();
        this.formPQuestions.get('sections')?.get('questions')?.disable();
      }

    });

    this.getAddressDetails();

    this.getPqquestionnariesdata();

    // this.commonService.GetpqquetionariesCheckListData().subscribe({
    //   next: (data: any) => {
    //     this.pqquestionnaries = data[6];
    //     this.formPQuestions = this.fb.group({
    //       supplierClassification: [this.pqquestionnaries.templateName],
    //       templateID: [this.pqquestionnaries.templateID],
    //       supplierID: JSON.stringify(this.supplierId),
    //       sections: this.fb.array([]) // Initialize the sections array dynamically
    //     });
    //     this.setSections(this.pqquestionnaries.sections);
    //   },
    //   error: (err: any) => {
    //   }
    // });

    // const jsonArray = [{ "SupplierId": this.supplierId, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "1", "complianceFieldName": "Does Your company adhere to ethical sourcing practices?", "complianceFieldResponse": "" }, { "SupplierId": 19, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "2", "complianceFieldName": "Financial Stability:", "complianceFieldResponse": "" }, { "SupplierId": 19, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "3", "complianceFieldName": "Cybersecurity measures to protect sensitive information", "complianceFieldResponse": "" }, { "SupplierId": 19, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "4", "complianceFieldName": "Contractual Compliance:", "complianceFieldResponse": "" }, { "SupplierId": 19, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "5", "complianceFieldName": "Compliance with data privacy regulations (e.g., GDPR, CCPA)", "complianceFieldResponse": "" }, { "SupplierId": 19, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "6", "complianceFieldName": "Please enter the date your company was established in the format DD/Mon/YYYY.", "complianceFieldResponse": "2024-12-02T12:00:00+05:30" }, { "SupplierId": 19, "LoggedIn": 20, "ComplianceCheckId": 0, "cvFieldId": "7", "complianceFieldName": "Does your company have a commitment to environmental ?", "complianceFieldResponse": "" }]
    // this.complianceCheckService.SaveComplianceCheckListData(jsonArray).subscribe(
    //   (res: any) => {
    //     this.tabValidCheckEmit.emit();

    //     this.savePQquestionnaries(false);
    //   },
    //   (error: any) => {
    //   });

    this.activateRouter?.params?.subscribe((response) => {

      if (response.status === 'In-Progress') {
        this.formPQuestions.disable();
        this.formPQuestions.get('sections')?.get('questions')?.disable();
      }
    });
  }

  getPqquestionnariesdata() {
    this.commonService.GetpqquetionariesSupplier(this.supplierId).subscribe({
      next: (datas: any) => {
        if (datas.length !== 0) {
          this.questionAnswer = datas;

          this.commonService.getpqQuestionnariesList().subscribe({
            next: (data: any) => {
              this.pqquestionnaries = data[0];
              this.formPQuestions = this.fb.group({
                supplierClassification: [this.pqquestionnaries?.templateName],
                templateID: [this.pqquestionnaries?.templateID],
                supplierID: JSON.stringify(this.commonService?.SupplierId),
                sections: this.fb.array([]) // Initialize the sections array dynamically
              });
              this.setSections(this.pqquestionnaries.sections);
            },
            error: (err: any) => {
            }
          });
        } else {

          this.commonService.getpqQuestionnariesList().subscribe({
            next: (data: any) => {
              this.pqquestionnaries = data[0];
              this.formPQuestions = this.fb.group({
                supplierClassification: [this.pqquestionnaries.templateName],
                templateID: [this.pqquestionnaries.templateID],
                supplierID: JSON.stringify(this.supplierId),
                sections: this.fb.array([]) // Initialize the sections array dynamically
              });
              this.setSections(this.pqquestionnaries.sections);
            },
            error: (err: any) => {
            }
          });
        }
      }, error: (err: any) => {

        this.commonService.getpqQuestionnariesList().subscribe({
          next: (data: any) => {
            this.pqquestionnaries = data[0];
            this.formPQuestions = this.fb.group({
              supplierClassification: [this.pqquestionnaries.templateName],
              templateID: [this.pqquestionnaries.templateID],
              supplierID: JSON.stringify(this.supplierId),
              sections: this.fb.array([]) // Initialize the sections array dynamically
            });
            this.setSections(this.pqquestionnaries.sections);
          },
          error: (err: any) => {
          }
        });
      }
    })
  }

  get sections(): FormArray {
    return this.formPQuestions.get('sections') as FormArray;
  }

  clearValues(): boolean {

    if (this.formPQuestions?.valid) {
      this.SaveDraftFlag.emit(true)

    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.formPQuestions);
  }

  NextButtonValidation() {

    if (this.questionAnswer !== undefined) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }

  getquestionselection(eventIndex: number): FormArray {
    return this.sections.at(eventIndex).get('questions') as FormArray;
  }

  getchildQuestion(i: number, j: number): FormArray {
    return this.getquestionselection(i).at(j).get('childResponses') as FormArray;
  }

  toggleAttach(i: any, j: any) {
    const key = `${i}-${j}`; // Create a unique key based on both `i` and `j`
    // Toggle the visibility for the sidebar with the composite key
    this.attachToggle[key] = !this.attachToggle[key];
  }

  closeAttach(i: any, j: any) {
    const key = `${i}-${j}`; // Generate the unique key
    this.attachToggle[key] = false;
  }

  getKey(i: number, j: number): string {
    return `${i}-${j}`; // Create and return the composite key
  }

  childtoggleAttach(i: any, j: any, k: any) {
    const key = `${i}-${j}-${k}`;
    this.childattachToggle[key] = !this.childattachToggle[key];
  }

  childcloseAttach(i: any, j: any, k: any) {
    const key = `${i}-${j}-${k}`;
    this.childattachToggle[key] = false;
  }

  getchildKey(i: number, j: number, k: number): string {
    return `${i}-${j}-${k}`; // Create and return the composite key
  }

  getAddressDetails() {
    this.supplierUserFormService.getAddressDetails(this.supplierId).subscribe((res: any) => {
      if (res) {
        localStorage.setItem('country', res[0]?.countryName)

      }
      this.tabValidCheckEmit.emit();
      // this.updateDefaultMainOfficeStatus();
    })
  }

  downloadBase64File(base64Data: string, fileName: string): void {
    const src = `${base64Data}`;
    const link = document.createElement("a")
    link.href = src
    link.download = fileName
    link.click()

    link.remove()
  }

  addBase64Padding(base64: string): string {
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    return base64;
  }

  getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'txt': 'text/plain',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'csv': 'text/csv'
    };
    return mimeTypes[extension!] || 'application/octet-stream';
  }


  // Dynamically populate the sections array
  setSections(sectionsData: any) {

    const sectionsFormArray = this.formPQuestions.get('sections') as FormArray;

    sectionsData.forEach((section: {
      templateID: any;
      sectionID: any;
      questions: any; sectionName: any;
    }) => {
      sectionsFormArray.push(this.fb.group({
        sectionID: [section?.sectionID],
        templateID: [section?.templateID],
        sectionName: [section?.sectionName],
        questions: this.fb.array([]) // Initialize questions array dynamically
      }));

      // Populate questions for each section
      const sectionQuestionsArray = (sectionsFormArray.at(sectionsFormArray.length - 1) as FormGroup).get('questions') as FormArray;
      section.questions.forEach((question: {
        questionResponseID: any;
        attachmentBase64: any;
        attachmentNamePath: any;
        questionID: any;
        sectionID: any;
        isvisible: any;
        childQuestion: any; questions: any; responseType: any; allowAttachments: any;
      }) => {
        sectionQuestionsArray.push(this.fb.group({
          questionResponseID: [question?.questionResponseID],
          questionID: [question?.questionID],
          sectionID: [question?.sectionID],
          questionText: [question?.questions],
          userResponse: [''],
          userResponseOption: [''],
          attachmentPath: [''],
          attachmentNamePath: [question?.attachmentNamePath],
          attachmentBase64: [question?.attachmentBase64],
          responseType: [question?.responseType],
          isvisible: [question?.isvisible],
          allowAttachments: [question?.allowAttachments],
          childResponses: this.fb.array([]) // Initialize childQuestions array dynamically
        }));

        const lastQuestion = sectionQuestionsArray.at(sectionQuestionsArray.length - 1) as FormGroup;

        // // Check if 'allowAttachments' is 'Mandatory' and apply validation dynamically
        // if (question.allowAttachments === 'mandatory' && question.responseType !== 'checkbox' || question.allowAttachments === 'mandatory' && question.responseType !== 'binary') {
        //   // Apply the required validator to 'childQuestionAnswer'
        //   lastQuestion.get('userResponse')?.setValidators([Validators.required]);
        //   lastQuestion.get('userResponse')?.updateValueAndValidity(); // Update validity after setting the validator
        // }

        if (question.responseType === "text" || question.responseType === "date" && this.questionAnswer === undefined) {
          lastQuestion.get('userResponse')?.setValidators([Validators.required]);
          lastQuestion.get('userResponse')?.updateValueAndValidity();
        } 
        // else if (question.responseType === "binary") {
        //   lastQuestion.get('userResponseOption')?.setValidators([Validators.required]);
        //   lastQuestion.get('userResponseOption')?.updateValueAndValidity();
        // }

        if (question.allowAttachments === 'mandatory' && !question?.attachmentNamePath && this.questionAnswer === undefined) {
          // Apply the required validator to 'childQuestionAnswer'
          lastQuestion.get('attachmentPath')?.setValidators([Validators.required]);
          // lastQuestion.get('attachmentPath')?.updateValueAndValidity(); // Update validity after setting the validator
        }

        // Populate child questions for each question
        const childQuestionsArray = (sectionQuestionsArray.at(sectionQuestionsArray.length - 1) as FormGroup).get('childResponses') as FormArray;
        question.childQuestion?.forEach((childQuestion: {
          childQuestionResponseID: any;
          attachmentNamePath: any;
          attachmentBase64: any;
          questionID: any;
          childQuestionID: any; childQuestions: any; responseType: any; allowAttachments: any;
        }) => {
          childQuestionsArray.push(this.fb.group({
            childQuestionResponseID: [childQuestion?.childQuestionResponseID],
            childQuestionID: [childQuestion?.childQuestionID],
            questionID: [childQuestion?.questionID],
            childQuestion: [childQuestion?.childQuestions],
            userResponse: [''],
            userResponseOption: [''],
            attachmentPath: [''],
            attachmentBase64: [childQuestion?.attachmentBase64],
            attachmentNamePath: [childQuestion?.attachmentNamePath],
            responseType: [childQuestion?.responseType],
            allowAttachments: [childQuestion?.allowAttachments]
          }));

          const lastChildQuestion = childQuestionsArray.at(childQuestionsArray.length - 1) as FormGroup;

          // Check if 'allowAttachments' is 'Mandatory' and apply validation dynamically
          // if (childQuestion.responseType === 'text' || childQuestion.responseType === 'date') {
          //   lastChildQuestion.get('userResponse')?.setValidators([Validators.required]);
          //   lastChildQuestion.get('userResponse')?.updateValueAndValidity(); // Update validity after setting the validator
          // }
          // if (childQuestion.allowAttachments === 'mandatory' && childQuestion.responseType === 'checkbox' || childQuestion.allowAttachments === 'mandatory' && childQuestion.responseType === 'binary') {

          if (question?.responseType === 'checkbox' && question?.isvisible === 0 && this.questionAnswer === undefined) {
            if (childQuestion.responseType === "text" || childQuestion.responseType === "date") {
              lastChildQuestion.get('userResponse')?.addValidators([Validators.required])
              // lastQuestion.get('userResponse')?.updateValueAndValidity();
            }
            //  else if (childQuestion.responseType === "binary") {
            //   lastChildQuestion.get('userResponseOption')?.addValidators([Validators.required])
            //   // lastQuestion.get('userResponseOption')?.updateValueAndValidity();
            // }
          }

          if (question?.responseType === 'checkbox' && question?.isvisible === 0 && this.questionAnswer === undefined) {
            if (childQuestion.allowAttachments === 'mandatory' && !childQuestion.attachmentNamePath) {
              // lastChildQuestion.addValidators([Validators.required])
                  lastChildQuestion.get('attachmentPath')?.addValidators([Validators.required]);
                  // lastChildQuestion.get('attachmentPath')?.updateValueAndValidity(); // Update validity after setting the validator
            }
          }

        });
      });
    });

    // this.setFormValues(sectionsData);

    if (this.questionAnswer !== 0) {

      // Iterate over each supplier response
      this.questionAnswer?.forEach((supplier: { sections: any; }) => {
        const sectionsData = supplier.sections;
        sectionsData.forEach((section: {
          sectionID: any; questions: {
            questionResponseID: any; questionID: any; userResponse: any; userResponseOption: any; attachmentPath: any; attachmentNamePath: any; attachmentBase64: any; childResponses: {
              childQuestionResponseID: any; childQuestionID: any; userResponse: any; userResponseOption: any; attachmentPath: any; attachmentNamePath: any;
              attachmentBase64: any;
            }[];
          }[];
        }) => {
          // Find the corresponding section in the FormArray
          const sectionFormGroup = sectionsFormArray.controls.find(
            (control) => control.value.sectionID === section.sectionID
          ) as FormGroup;

          if (sectionFormGroup) {
            const questionsFormArray = sectionFormGroup.get('questions') as FormArray;

            section.questions.forEach((question: {
              questionResponseID: any;
              questionID: any; userResponse: any; userResponseOption: any; attachmentPath: any; attachmentBase64: any; attachmentNamePath: any; childResponses: {
                childQuestionResponseID: any; childQuestionID: any; userResponse: any; userResponseOption: any; attachmentPath: any; attachmentNamePath: any;
                attachmentBase64: any;
              }[];
            }) => {

              // Find the corresponding question in the FormArray
              const questionFormGroup = questionsFormArray.controls.find(
                (control) => control.value.questionID === question.questionID
              ) as FormGroup;

              if (questionFormGroup) {
                
                // Update question response fields
                questionFormGroup.patchValue({
                  questionResponseID: question?.questionResponseID,
                  userResponse: question?.userResponse,
                  userResponseOption: question?.userResponseOption,
                  attachmentPath: question?.attachmentPath,
                  attachmentBase64: question?.attachmentBase64,
                  attachmentNamePath: question?.attachmentNamePath,
                });

                const childQuestionsArray = questionFormGroup.get('childResponses') as FormArray;

                question.childResponses.forEach((childResponse: {
                  childQuestionResponseID: any;
                  attachmentNamePath: any;
                  attachmentBase64: any; childQuestionID: any; userResponse: any; userResponseOption: any; attachmentPath: any;
                }) => {
                  // Find or add the child question
                  const childQuestionFormGroup = childQuestionsArray.controls.find(
                    (control) => control.value.childQuestionID === childResponse.childQuestionID
                  ) as FormGroup;

                  if (childQuestionFormGroup) {
                    // Update child question response fields
                    childQuestionFormGroup.patchValue({
                      childQuestionResponseID: childResponse?.childQuestionResponseID,
                      userResponse: childResponse?.userResponse,
                      userResponseOption: childResponse?.userResponseOption,
                      attachmentPath: childResponse?.attachmentPath,
                      attachmentBase64: childResponse?.attachmentBase64,
                      attachmentNamePath: childResponse?.attachmentNamePath,
                    });
                  } else {
                    // If child question doesn't exist, add a new one
                    childQuestionsArray.push(
                      this.fb.group({
                        childQuestionResponseID: [childResponse?.childQuestionResponseID],
                        childQuestionID: [childResponse?.childQuestionID],
                        questionID: [question?.questionID], // Use correct mapping
                        childQuestion: [''], // Default values for missing fields
                        userResponse: [childResponse?.userResponse],
                        userResponseOption: [childResponse?.userResponseOption],
                        attachmentPath: [childResponse?.attachmentPath],
                        responseType: [''], // Placeholder or map appropriately
                        allowAttachments: [false], // Default value or map
                      })
                    );
                  }
                });
              }
            });
          }
        });
      });

    }


    this.activateRouter?.params?.subscribe((response) => {

      if (response.status === 'In-Progress') {
        this.formPQuestions.disable();
        this.formPQuestions.get('sections')?.get('questions')?.disable();
      }

    });

  }

  questionCheckbox(participant: AbstractControl, sectionIndex: number, questionIndex: number) {
    const childResponsesArray = (this.sections.controls[sectionIndex] as FormGroup)
      .get('questions') as FormArray;

    const childQuestionArray = (childResponsesArray.at(questionIndex) as FormGroup)
      .get('childResponses') as FormArray;

    if (childQuestionArray) {

      childQuestionArray.controls.forEach((childQuestion: AbstractControl) => {


        if (childQuestion) {
          const userResponseControl = childQuestion.get('userResponse');
          const userResponseControlAttachment = childQuestion.get('attachmentPath');
          const userResponseControlmandatory = childQuestion.get('mandatory');
          console.log(userResponseControl?.valid);
          
          if (
            participant?.value.isvisible === 1 && participant?.value?.userResponseOption === true && this.questionAnswer === undefined && !userResponseControl?.value ||
            participant?.value.isvisible === 0 && participant?.value?.userResponseOption === false && this.questionAnswer === undefined && !userResponseControl?.value ||
            participant?.value.isvisible === 0 && participant?.value?.userResponseOption === 'No' ||
            participant?.value.isvisible === 1 && participant?.value?.userResponseOption === 'Yes'
          ) {
            userResponseControl?.setValidators([Validators.required]);
            if(userResponseControlmandatory){
              userResponseControlAttachment?.setValidators([Validators.required]);
            }
            // userResponseControl?.updateValueAndValidity();
            // userResponseControlAttachment?.updateValueAndValidity();
          } else {
            userResponseControl?.clearValidators();
            userResponseControlAttachment?.clearValidators();
            userResponseControl?.updateValueAndValidity();
            userResponseControlAttachment?.updateValueAndValidity();
          }
        }
      });
    }
  }

  async onFileChangeQuestion(event: Event, i: number, j: number): Promise<void> {

    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0]; // Only consider the first file
      const base64 = await this.convertToBase64(file);

      // Update the form control for the specific index
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
      };

      const sectionsFormArray = this.formPQuestions.get('sections') as FormArray;

      const sectionQuestionsArray = (sectionsFormArray.at(i) as FormGroup).get('questions') as FormArray;
      sectionQuestionsArray.at(j).get('attachmentBase64')?.setValue(base64);
      sectionQuestionsArray.at(j).get('attachmentNamePath')?.setValue(fileData.name);
    }
    // this.toggleAttach();
  }

  // Handle file change event
  async onFileChangeChild(event: Event, i: number, j: number, k: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0]; // Only consider the first file
      const base64 = await this.convertToBase64(file);

      // Update the form control for the specific index
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
      };

      const sectionsFormArray = this.formPQuestions.get('sections') as FormArray;

      const sectionQuestionsArray = (sectionsFormArray.at(i) as FormGroup).get('questions') as FormArray;
      const childQuestionsArray = (sectionQuestionsArray.at(j) as FormGroup).get('childResponses') as FormArray;
      childQuestionsArray.at(k).get('attachmentBase64')?.setValue(base64);
      childQuestionsArray.at(k).get('attachmentNamePath')?.setValue(fileData?.name);

    }
  }

  // Convert file to base64
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  formatDate(date: string) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ssZ');  // Use any format you need
  }

  PQquestionnaries(isNextClick: boolean = false) {

    if (isNextClick && this.formPQuestions.dirty && this.formPQuestions.valid && this.questionAnswer !== undefined) {
      this.confirmatioPopUp(isNextClick);
    } else if (!isNextClick && this.formPQuestions) {
      const formData = this.formPQuestions.value;

      // Iterate through the form array and format dates
      formData.sections.forEach((section: { questions: any[]; }) => {
        section.questions.forEach(question => {

          if (question.responseType === 'date') {
            question.userResponse = this.formatDate(question.userResponse);

            question.childQuestion?.forEach((child: {
              userResponseOption: any; responseType: string; userResponse: any;
            }) => {

              if (child.responseType === 'date') {
                child.userResponse = this.formatDate(child.userResponse);
              }
            });
          }
          if (question.userResponseOption === true || question.userResponseOption === false) {
            question.userResponseOption = question.userResponseOption === true? JSON.stringify(question.userResponseOption) : '';
          }

          question?.childResponses.forEach((child: any) => {

            if (child.responseType === 'date') {
              child.userResponse = this.formatDate(child.userResponse);
            }
            if (child.userResponseOption === true || child.userResponseOption === false) {
              child.userResponseOption = JSON.stringify(child.userResponseOption);
            }
          })


        });

      });

      this.formPQuestions.markAllAsTouched();
      if (this.questionAnswer !== undefined) {


        this.commonService.updatePQquestionnaries(formData).subscribe((response) => {
          this.getPqquestionnariesdata();
          this.adminService.showMessage('Data on the form has been saved successfully');
          if (response.success) {
            this.formPQuestions.reset();
            if (isNextClick) {
              setTimeout(() => {
                this.nextTabEmit.emit(true);
              }, 1000);
            }
            if (this.previousTabClick) {
              setTimeout(() => {
                this.dialogResult.emit(true);
              }, 1000);
            }
          }
          else {
            // this.formPQuestions.reset();
            this.adminService.showMessage('Data on the form has been saved successfully');
            if (isNextClick) {
              setTimeout(() => {
                this.nextTabEmit.emit(true);
              }, 1000);
            }
            if (this.previousTabClick) {
              setTimeout(() => {
                this.dialogResult.emit(true);
              }, 1000);
            }
          }

        });

      } else {
        if (this.formPQuestions.valid) {
          this.commonService.savePQquestionnaries(formData).subscribe((response) => {
            this.getPqquestionnariesdata();
            this.adminService.showMessage('Data on the form has been saved successfully');
            if (response.success) {
              this.formPQuestions.reset();
              if (isNextClick) {
                setTimeout(() => {
                  this.nextTabEmit.emit(true);
                }, 1000);
              }
              if (this.previousTabClick) {
                setTimeout(() => {
                  this.dialogResult.emit(true);
                }, 1000);
              }
            }
          });
        }
      }
    } else if (isNextClick && !this.formPQuestions.dirty) {
      this.nextTabEmit.emit();
    } else {
      if (this.formPQuestions.valid) {
        if (isNextClick) {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        } else {
          this.adminService.showMessage('Please fill in all mandatory fields before save');
        }
      }
    }
  }

  updatePq() {
    const formData = this.formPQuestions.value;
    this.commonService.updatePQquestionnaries(formData).subscribe((response) => {
      if (response.success) {
        this.adminService.showMessage('Data on the form has been saved successfully');
        this.formPQuestions.reset();

        setTimeout(() => {
          this.nextTabEmit.emit(true);
        }, 1000);

        if (this.previousTabClick) {
          setTimeout(() => {
            this.dialogResult.emit(true);
          }, 1000);
        }
      }
      else {
        // this.formPQuestions.reset();
        this.adminService.showMessage('Data on the form has been saved successfully');

        setTimeout(() => {
          this.nextTabEmit.emit(true);
        }, 1000);
      }
      if (this.previousTabClick) {
        setTimeout(() => {
          this.dialogResult.emit(true);
        }, 1000);
      }

    });

  }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {

    const financialFields = Object.values(this.formPQuestions.controls).some(control => control.dirty || control.value);

    if (financialFields && this.formPQuestions.dirty) {
      const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        hasBackdrop: true,
        autoFocus: true,
        width: '35%',
        height: '40%',
        position: {
          top: 'calc(10vw + 20px)',
        },
        panelClass: 'confirmdialog',
        data: {
          parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference
          checkBtnValue: isNextClick ? "next" : isPreviousClick ? "previous" : ""
        },
      });
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (isNextClick) {
            // this.PQquestionnaries();
            this.nextTabEmit.emit();
          } else {
            // this.PQquestionnaries();
            this.dialogResult.emit(true);
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
            // this.nextTabEmit.emit();
          } else {
            this.dialogResult.emit(true);
          }

        }
      });
    } else {
      if (isNextClick) {
        this.nextTabEmit.emit();
      } else {
        this.dialogResult.emit(true);
      }
    }

  }

  openAccordionAll() {
    this.isOpen = true;
  }
  closeAccordionAll() {
    this.isOpen = false;
  }
  savePQquestionnaries(isNextClick: boolean = false) {
    if (isNextClick) {
      setTimeout(() => {
        this.nextTabEmit.emit();
      }, 1000);
    }
    if (this.previousTabClick) {
      setTimeout(() => {
        this.dialogResult.emit(true);
      }, 1000);
    }
  }

  // Method to open the popup with the image
  openImagePopup(base64Image: string): void {
    this.popupImage = this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    this.showPopup = true;
  }

  // Method to close the popup
  closePopup(): void {
    this.showPopup = false;
    this.popupImage = null;
  }

}

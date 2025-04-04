import { Component, ElementRef, HostListener, inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MultiFactorAuthenticationComponent } from '../auth-module/multi-factor-authentication/multi-factor-authentication.component';
import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { SupplierRegistrationComponent } from '../supplier-registration/supplier-registration.component';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../core/services/language/language.service';
import { CommonService } from '../core/services/common.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { AdminService } from '../core/services/admin/admin.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../auth-module/forgot-password/forgot-password.component';
import { environment } from '../../environments/environment';
import { SessionTimeoutService } from '../core/services/session-timeout.service';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from '../core/services/login/login.service';
import { SupplierUserFormService } from '../core/services/supplier-management/supplier.user.form.service';
import { DateTimeService } from '../core/date-time/date-time.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CacheService } from '@app/core/services/cache/cache.service';

interface PublishedEventData {
  eventRef: string;
  publishedDate: string;
  eventName: string;
  description: string;
  submissionDate: string;
  categoryScope: string;
}
@Component({
  selector: 'app-home-page',
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
  imports: [NgClass, MatFormField, MatLabel, MatToolbarModule, MatTooltip, MatSelect, MatOption, ScrollPanelModule, MatCheckbox, FormsModule, ReactiveFormsModule, MatInput, MatError, MatIcon, MatSuffix, NgIf, MatButton, MatDialogTitle, MatIconButton, MatDialogClose, CdkScrollable, MatDialogContent, NgFor, MatDialogActions, MatTabGroup, MatTab, MatPaginator, TranslatePipe]
})


export class HomePageComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  SupplierlogInForm!: FormGroup;
  selectedLanguage = 'en';
  isRtl: boolean = false;
  submitLoginData = new SupplierSubmitLoginData();
  loginData = new SupplierLoginData();
  logInDetails: any;

  @ViewChild('downloadDoc') downloadDoc: any;
  @ViewChild('publishedSE') publishedSE: any;
  dialogRef: any;
  documents: { name: string; path: string; selected: boolean }[] = [];

  mfaCode: string = '';
  userId!: number;
  isResendDisabled: boolean = false;
  resendCountdown: number = 90; // Countdown in seconds
  countdownInterval: any;

  CSEData = [
    {
      eventRef: 'EVT001',
      publishedDate: '2024-10-01',
      eventName: 'Event 1',
      description: 'Description of Event 1',
      submissionDate: '2024-10-02',
      categoryScopeCombination: 'Scope A',
      supplierName: 'supplier 1',
      awardDate: '2024-10-02',
      currency: '1000'
    },
    {
      eventRef: 'EVT002',
      publishedDate: '2024-10-02',
      eventName: 'Event 2',
      description: 'Description of Event 2',
      submissionDate: '2024-10-03',
      categoryScopeCombination: 'Scope B',
      supplierName: 'supplier 2',
      awardDate: '2024-10-02',
      currency: '2000'
    },
    {
      eventRef: 'EVT003',
      publishedDate: '2024-10-05',
      eventName: 'Event 3',
      description: 'Description of Event 3',
      submissionDate: '2024-10-06',
      categoryScopeCombination: 'Scope C',
      supplierName: 'supplier 3',
      awardDate: '2024-10-02',
      currency: '3000'
    },
    {
      eventRef: 'EVT004',
      publishedDate: '2024-10-10',
      eventName: 'Event 4',
      description: 'Description of Event 4',
      submissionDate: '2024-10-11',
      categoryScopeCombination: 'Scope D',
      supplierName: 'supplier 4',
      awardDate: '2024-10-02',
      currency: '4000'
    }
  ]

  fiveDaysData: PublishedEventData[] = [
    {
      eventRef: 'EVT001',
      publishedDate: '2024-10-01',
      eventName: 'Event 1',
      description: 'Description of Event 1',
      submissionDate: '2024-10-02',
      categoryScope: 'Category A'
    },
    {
      eventRef: 'EVT002',
      publishedDate: '2024-10-02',
      eventName: 'Event 2',
      description: 'Description of Event 2',
      submissionDate: '2024-10-03',
      categoryScope: 'Category B'
    },
    {
      eventRef: 'EVT003',
      publishedDate: '2024-10-05',
      eventName: 'Event 3',
      description: 'Description of Event 3',
      submissionDate: '2024-10-06',
      categoryScope: 'Category C'
    },
    {
      eventRef: 'EVT004',
      publishedDate: '2024-10-10',
      eventName: 'Event 4',
      description: 'Description of Event 4',
      submissionDate: '2024-10-11',
      categoryScope: 'Category D'
    }
  ];

  tenDaysData: PublishedEventData[] = [
    {
      eventRef: 'EVT011',
      publishedDate: '2024-10-01',
      eventName: 'Event 1',
      description: 'Description of Event 11',
      submissionDate: '2024-10-02',
      categoryScope: 'Category 1A'
    },
    {
      eventRef: 'EVT012',
      publishedDate: '2024-10-02',
      eventName: 'Event 2',
      description: 'Description of Event 12',
      submissionDate: '2024-10-03',
      categoryScope: 'Category 1B'
    },
    {
      eventRef: 'EVT013',
      publishedDate: '2024-10-05',
      eventName: 'Event 3',
      description: 'Description of Event 13',
      submissionDate: '2024-10-06',
      categoryScope: 'Category 1C'
    },
    {
      eventRef: 'EVT014',
      publishedDate: '2024-10-10',
      eventName: 'Event 4',
      description: 'Description of Event 14',
      submissionDate: '2024-10-11',
      categoryScope: 'Category 1D'
    }
  ];

  fifteenDaysData: PublishedEventData[] = [
    {
      eventRef: 'EVT021',
      publishedDate: '2024-10-01',
      eventName: 'Event 1',
      description: 'Description of Event 211',
      submissionDate: '2024-10-02',
      categoryScope: 'Category 2A'
    },
    {
      eventRef: 'EVT022',
      publishedDate: '2024-10-02',
      eventName: 'Event 2',
      description: 'Description of Event 221',
      submissionDate: '2024-10-03',
      categoryScope: 'Category 2B'
    },
    {
      eventRef: 'EVT023',
      publishedDate: '2024-10-05',
      eventName: 'Event 3',
      description: 'Description of Event 231',
      submissionDate: '2024-10-06',
      categoryScope: 'Category 2C'
    },
    {
      eventRef: 'EVT024',
      publishedDate: '2024-10-10',
      eventName: 'Event 4',
      description: 'Description of Event 241',
      submissionDate: '2024-10-11',
      categoryScope: 'Category 2D'
    }
  ];

  othersData: PublishedEventData[] = [
    {
      eventRef: 'EVT031',
      publishedDate: '2024-10-01',
      eventName: 'Event 1',
      description: 'Description of Event 3111',
      submissionDate: '2024-10-02',
      categoryScope: 'Category 3A'
    },
    {
      eventRef: 'EVT032',
      publishedDate: '2024-10-02',
      eventName: 'Event 2',
      description: 'Description of Event 3211',
      submissionDate: '2024-10-03',
      categoryScope: 'Category 3B'
    },
    {
      eventRef: 'EVT033',
      publishedDate: '2024-10-05',
      eventName: 'Event 3',
      description: 'Description of Event 3311',
      submissionDate: '2024-10-06',
      categoryScope: 'Category 3C'
    },
    {
      eventRef: 'EVT034',
      publishedDate: '2024-10-10',
      eventName: 'Event 4',
      description: 'Description of Event 3411',
      submissionDate: '2024-10-11',
      categoryScope: 'Category 3D'
    }
  ];

  dataMap: { [key in 'tab1' | 'tab2' | 'tab3' | 'tab4']: PublishedEventData[] } = {
    tab1: this.fiveDaysData,
    tab2: this.tenDaysData,
    tab3: this.fifteenDaysData,
    tab4: this.othersData,
  };

  // Ensure currentTab is typed as one of the keys
  currentTab: 'tab1' | 'tab2' | 'tab3' | 'tab4' = 'tab1';
  agreeDownloadCenter: boolean = false;
  showMFA: boolean = false;
  sessionTimeOut: any;
  sessionTextField: any;
  sessionMinsSeconds: any;
  companylogo: any;
  logoSrc: string = "";
  companydescription: any;
  copyrightFooter: any;
  landingPagetitle: any;
  document: any[] = [];
  selectedFilePaths: string[] = [];
  selectedIndexes: Set<number> = new Set();
  selectAllChecked: boolean = false;

  isPasswordVisible: boolean = false;  // Flag to control password visibility
  getImplementationConfigDataRes: any;
  cachedData: any;

  //readonly dialogRef = inject(MatDialog);
  constructor(private fb: FormBuilder,
    public translate: TranslateService,
    private languageService: LanguageService,
    public commonService: CommonService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private http: HttpClient,
    public admin: AdminService,
    private elementRef: ElementRef,
    public adminService: AdminService,
    public route: Router,
    public supplierUser: SupplierUserFormService,
    private sessionTimeoutService: SessionTimeoutService,
    private dateTimeService: DateTimeService,
    private cacheService: CacheService
  ) {
    this.sessionTimeoutService.stopSessionTimeout();
    this.initSupplierForm();
    this.translate.setDefaultLang('en');
    this.loadDocuments();
    this.GetSystemParamTimeExpried();
    this.GetImplementationConfigData();
    // this.getUser();
  }
  ngoninit() {
    this.cacheService.clearCache();
    if (this.cacheService.hasCache('userData')) {
      this.cachedData = this.cacheService.getCache('userData');
    } else {
      // Simulating fetching data
      const fetchedData = { name: 'John Doe', age: 30 };
      this.cacheService.setCache('userData', fetchedData);
      this.cachedData = fetchedData;
    }
  }

  GetImplementationConfigData() {
    this.supplierUser.GetImplementationConfigData().subscribe(res => {
      if (res) {
        this.getImplementationConfigDataRes = res;
        this.companylogo = res.companyLogo;
        this.companydescription = res.companyDescription;
        this.copyrightFooter = res.copyrightFooter;
        this.landingPagetitle = res.landingPageTitle;
        this.document = [
          {
            name: 'Code of Conducts',
            ...res.codeOfConduct,
            filePath: res.codeOfConduct?.filePath || '',
            //...res.filePath
          },
          {
            name: 'Registration Guideliness',
            ...res.registrationGuidelines,
            filePath: res.registrationGuidelines?.filePath || '',
          },
        ];
        if (this.companylogo.fileContent) {
          this.logoSrc = this.companylogo.fileContent;
        }
      }
    })
  }

  // Toggle Select All
  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;

    if (this.selectAllChecked) {
      this.selectedIndexes = new Set(
        this.document.map((_, index) => index)
      );
    } else {
      this.selectedIndexes.clear();
    }
  }


  toggleSelection(event: any, index: number) {
    if (event.checked) {
      this.selectedIndexes.add(index);
    } else {
      this.selectedIndexes.delete(index);
    }
    this.selectAllChecked = this.selectedIndexes.size === this.document.length;
  }


  downloadSelectedFiles() {
    const selectedFiles = Array.from(this.selectedIndexes).map(
      (index) => ({
        fileName: this.document[index].fileName,
        filePath: this.document[index].filePath
      })
    );

    if (selectedFiles.length > 0) {
      const filePaths = selectedFiles.map(file => file.filePath);

      // Send the file paths to the backend in the correct JSON format
      this.supplierUser.downloadMultipleFiles(filePaths).subscribe({
        next: (fileResponses: any[]) => {
          fileResponses.forEach((response) => {
            if (response.fileContent) {
              // Decode the Base64 content
              const byteCharacters = atob(response.fileContent);
              const byteNumbers = new Array(byteCharacters.length).map((_, i) =>
                byteCharacters.charCodeAt(i)
              );
              const byteArray = new Uint8Array(byteNumbers);

              // Create a Blob from the byte array
              const blob = new Blob([byteArray], { type: 'application/octet-stream' });

              // Create a URL for the Blob object
              const downloadUrl = window.URL.createObjectURL(blob);

              // Create a temporary anchor element to trigger the download
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = response.fileName; // Use the file name from the response
              link.click(); // Trigger the download
              window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
            } else {
              console.error('Error: ', response.error || 'Unknown error');
            }
          });
        },
        error: (err) => {
          console.error('Download failed', err);
        }
      });

    } else {
      alert('Please select at least one file.');
    }
  }




  GetSystemParamTimeExpried() {
    this.supplierUser.GetSysParameterGeneral().subscribe(res => {
      if (res != null) {
        if (res.sessionTimeOut && res.sessionMinsSeconds !== null && res.sessionTextField !== null) {
          this.sessionTimeOut = res.sessionTimeOut;
          this.sessionTextField = res.sessionTextField;
          this.sessionMinsSeconds = res.sessionMinsSeconds;
        }
      }
    })
  }
  //readonly dialog = inject(MatDialog);
  // openDialog() {
  //   this.dialog.open(MultiFactorAuthenticationComponent, {
  //     width: '60%',
  //     height: '40%'
  //   });
  // }

  initSupplierForm() {
    this.SupplierlogInForm = this.fb.group({
      userName: ['', [Validators.required]],
      mfaCode: ['', []],
      passWord: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_-])[A-Za-z\\d@$!%*?&#_-]{8,}$')
        ],
      ],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;  // Toggle visibility
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    //document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; // Change text direction
    this.isRtl = language === 'ar'; // Set RTL if Arabic
    this.languageService.setLanguage(language); // Update language in service
  }
  // Login and MFA code
  login() {

    const login = {
      "emailOrUsername": this.SupplierlogInForm.value.userName,
      "password": this.SupplierlogInForm.value.passWord,
    }

    this.loginService.getJwtToken(login).subscribe({
      next: res => {
        if (res) {
          localStorage.setItem('JwtToken', res?.token)

          this.SupplierlogInForm.get('mfaCode')?.clearValidators();
          this.SupplierlogInForm.get('mfaCode')?.updateValueAndValidity();
          if (this.SupplierlogInForm.valid) {
            this.logInDetails = [];
            this.commonService.userName = this.SupplierlogInForm.value.userName;
            const logInInfo = this.SupplierlogInForm.value;
            this.loginService.logIn(logInInfo).subscribe((res: any) => {
              if (res.success == true) {

                localStorage.setItem('loginDetails', JSON.stringify(res));
                this.logInDetails = res;
                this.commonService.SupplierId = res.supplierId;
                this.commonService.UserId = res.userId;
                this.dateTimeService._format = 'dd:MM;YY'
                this.dateTimeService.setDateFormat();
                this.loginService.getScurity().subscribe((resData: any) => {
                  if (!resData?.enableOTPFlag) {
                    if (res?.userType === 1) {
                      this.route.navigate(['/krya/dashboard-menu'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true });
                    } else if (res.supplierCompletedFlag === true) {
                      this.route.navigate(['/krya/dashboard'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true })
                    }
                    else if (res?.userType === 2) {
                      this.route.navigate(['/SupplierUserForm'], { skipLocationChange: true, replaceUrl: true });
                    } else if (res?.userType === 3) {
                      this.route.navigate(['/ProcureZen']);
                    }
                  } else {
                    this.otpgenerate();
                  }
                })
                if (this.sessionTimeOut && this.sessionTextField !== null && this.sessionMinsSeconds !== null) {
                  this.sessionTimeoutService.startSessionTimeout(this.sessionTimeOut, this.sessionTextField, this.sessionMinsSeconds);
                }
              } else {
                this.adminService.showMessage(res.message);
              }
            })
          } else {
            this.adminService.showMessage('Please enter username and password');
          }
        }
      }, error: error => {
        this.SupplierlogInForm.get('mfaCode')?.clearValidators();
        this.SupplierlogInForm.get('mfaCode')?.updateValueAndValidity();
        if (this.SupplierlogInForm.valid) {
          this.logInDetails = [];
          this.commonService.userName = this.SupplierlogInForm.value.userName;
          const logInInfo = this.SupplierlogInForm.value;
          this.loginService.logIn(logInInfo).subscribe((res: any) => {
            if (res.success == true) {
              localStorage.setItem('loginDetails', JSON.stringify(res));
              this.logInDetails = res;
              this.commonService.SupplierId = res.supplierId;
              this.commonService.UserId = res.userId;
              this.dateTimeService._format = 'dd:MM;YY'
              this.dateTimeService.setDateFormat();
              this.loginService.getScurity().subscribe((resData: any) => {
                if (!resData?.enableOTPFlag) {
                  if (res?.userType === 1) {
                    this.route.navigate(['/krya/dashboard-menu'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true });
                  }
                  else if (res.supplierCompletedFlag === true) {
                    this.route.navigate(['/krya/dashboard'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true })
                  }
                  else if (res?.userType === 2) {
                    this.route.navigate(['/SupplierUserForm'], { skipLocationChange: true, replaceUrl: true });
                  } else if (res?.userType === 3) {
                    this.route.navigate(['/ProcureZen']);
                  }
                } else {
                  this.otpgenerate();
                }
              })
              if (this.sessionTimeOut && this.sessionTextField !== null && this.sessionMinsSeconds !== null) {
                this.sessionTimeoutService.startSessionTimeout(this.sessionTimeOut, this.sessionTextField, this.sessionMinsSeconds);
              }
            } else {
              this.adminService.showMessage(res.message);
            }
          })
        } else {
          this.adminService.showMessage('Please enter username and password');
        }

      }
    })
  }

  otpgenerate() {
    this.SupplierlogInForm.get('mfaCode')?.setValidators(Validators.required);
    this.SupplierlogInForm.get('mfaCode')?.updateValueAndValidity();
    this.loginData = new SupplierLoginData();
    this.loginData.userId = this.logInDetails.userId;
    this.loginData.toMailAddress = this.logInDetails.emailId;
    this.loginService.getOTPforMFA(this.loginData).subscribe((res: number) => {
      if (res) {
        this.showMFA = true;
        this.adminService.showMessage('OTP has been send to your registred Email ID');
        // this.openMFAPopUp();        
        this.startCountdown();
      } else {
        this.adminService.showMessage('OTP has been not generated. Please contact Admin');
      }
    })
  }
  openMFAPopUp() {
    this.dialog.open(MultiFactorAuthenticationComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '40%',
      height: '40%',
      position: {
        top: 'calc(6vw + 50px)',
        bottom: '',
        left: '',
        right: ''
      },
      data: { logInDetails: this.logInDetails },  // Pass userId to the child component
      panelClass: 'popUpMiddle',
    });
  }

  registrationPopUp() {
    if (this.agreeDownloadCenter == true) {
      // load the docment before open pop up
      this.dialog.open(SupplierRegistrationComponent, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: '',
        autoFocus: true,
        width: '85%',
        height: '85%',
        position: {
          top: 'calc(1vw + 20px)',
          bottom: '',
          left: '',
          right: ''
        },
        panelClass: 'popUpMiddle',
      });
    } else {
      this.adminService.showMessage('Please agree to pre requisites guidelines and sign up');
    }
  }

  // download center
  downloadPopUp() {
    // load the docment before open pop up
    this.dialog.open(this.downloadDoc, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '65%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {

        }
      })
    }
  }
  loadDocuments() {
    this.http.get<{ name: string; path: string }[]>('assets/documents-list.json')
      .subscribe((data: any) => {
        this.documents = data.map((doc: any) => ({
          ...doc,
          selected: false
        }));
      });
  }
  download() {
    this.documents
      .filter(doc => doc.selected)
      .forEach(doc => {
        const a = document.createElement('a');
        a.href = doc.path;
        a.download = doc.name;  // Use 'name' for the downloaded file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  // Check if all documents are selected
  // isAllSelected(): boolean {
  //   // Use strict boolean checks
  //   return this.documents.every(doc => doc.selected);
  // }
  // // Toggle Select All checkbox functionality
  // toggleSelectAll(checked: boolean) {
  //   this.documents.forEach(doc => (doc.selected = checked));
  // }
  dialogClose() {
    this.documents.forEach(doc => (doc.selected = false));
    this.dialogRef.close();
  }

  // View source event
  // View Source Event
  publishPopUp() {
    // load the docment before open pop up
    this.dialogRef = this.dialog.open(this.publishedSE, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '80%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  dialogCancel() {
    this.dialogRef.close();
  }

  ForgotPasswordPopUp() {
    this.dialog.open(ForgotPasswordComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '30%',
      height: '50%',
      position: {
        top: 'calc(7vw + 50px)',
        bottom: '',
        left: '',
        right: ''
      },
      // data: { logInDetails: this.logInDetails },  // Pass userId to the child component
      panelClass: 'forgot-popup',
    });
  }

  onForgotPswdSubmit() {
    this.ForgotPasswordPopUp();
  }

  getContentHeight() {
    let a = this.elementRef.nativeElement.ownerDocument.getElementsByTagName('body')[0].clientHeight;
    let b = Math.round(a);
    if (b && this.elementRef.nativeElement.getElementsByClassName('conainerHeight')[0]) {
      if (b >= 450) {
        this.elementRef.nativeElement.getElementsByClassName('conainerHeight')[0].style.minHeight = (b - 200) + 'px';
      }
      else {
        this.elementRef.nativeElement.getElementsByClassName('conainerHeight')[0].style.minHeight = '400px';
      }
    }
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.getContentHeight();
  }
  ngAfterViewChecked() {
    this.getContentHeight();
  }

  startCountdown() {
    this.isResendDisabled = true;
    this.resendCountdown = 90;
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  stopCountdown() {
    this.isResendDisabled = false;
    clearInterval(this.countdownInterval);
  }

  // resendOtp() {
  //   this.otpgenerate();
  //   this.startCountdown();
  // }

  // otpgenerate() {
  //   this.loginData = new SupplierLoginData();
  //   this.loginData.userId = this.data.logInDetails.userId;
  //   this.loginData.toMailAddress = this.data.logInDetails.emailId;
  //   this.loginService.getOTPforMFA(this.loginData).subscribe((res: number) => {
  //     if (res) {
  //       this.adminService.showMessage('OTP has been re - send to your registred email Id');
  //     } else {
  //       this.adminService.showMessage('OTP has been not generated. Please contact admin');
  //     }
  //   })
  // }

  submitMfa() {
    this.SupplierlogInForm.markAllAsTouched();
    this.submitLoginData.otpCode = this.SupplierlogInForm.value.mfaCode;
    this.submitLoginData.userId = this.logInDetails.userId;
    this.loginService.submitOTPforMFA(this.submitLoginData).subscribe((res: any) => {
      if (res) {
        if (res.userTypeId == this.commonService.supplierUserType) {
          // this.route.navigate(['/supplier']);
          // this.dialogRef.close();
          if (res.supplierCompletedFlag === true) {
            this.route.navigate(['/krya/dashboard'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true });
          }
          else {
            this.route.navigate(['/SupplierUserForm'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true });
          }
          // this.dialogRef.close();
        } else if (res.userTypeId == this.commonService.adminUserType) {
          this.route.navigate(['/krya/dashboard'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true });
        }
      } else {
        this.adminService.showMessage('Invalid OTP');
      }
    })
  }
  // end
}

export class SupplierLoginData {
  userId!: number;
  toMailAddress!: string;
}

export class SupplierSubmitLoginData {
  otpCode!: string;
  userId!: number;
}
interface SupplierUser {
  userName: string;
  userId: number;
  password: string;
  userType: string;
  confirmPassword: string;
  emailId: string;
  activeFlag: boolean;
  // other properties if needed
}

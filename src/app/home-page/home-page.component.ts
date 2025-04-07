import { Component, ElementRef, HostListener, inject, Renderer2, ViewChild, } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel, MatError, MatSuffix, } from "@angular/material/form-field";
import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions, } from "@angular/material/dialog";
import { SupplierRegistrationComponent } from "../supplier-registration/supplier-registration.component";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, } from "@angular/forms";
import { LanguageService } from "../core/services/language/language.service";
import { CommonService } from "../core/services/common.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from "@angular/material/snack-bar";
import { AdminService } from "../core/services/admin/admin.service";
import { Router } from "@angular/router";
import { ForgotPasswordComponent } from "../auth-module/forgot-password/forgot-password.component";
import { environment } from "../../environments/environment";
import { SessionTimeoutService } from "../core/services/session-timeout.service";
import { NgClass, NgIf, NgFor } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatButton, MatIconButton } from "@angular/material/button";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { LoginService } from "../core/services/login/login.service";
// import { SupplierUserFormService } from "../core/services/supplier-management/supplier.user.form.service";
import { MatToolbarModule } from "@angular/material/toolbar";


@Component({
  selector: "app-home-page",
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "standard" },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: "always" },
    },
  ],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  standalone: true,
  imports: [
    NgClass,MatFormField,MatLabel,MatToolbarModule,MatTooltip,MatSelect,MatOption,ScrollPanelModule,MatCheckbox,FormsModule,ReactiveFormsModule,MatInput,MatError,MatIcon,MatSuffix,NgIf,MatButton,MatDialogTitle,MatIconButton,MatDialogClose,CdkScrollable,MatDialogContent,NgFor,MatDialogActions,MatTabGroup,MatTab,
  ],
})
export class HomePageComponent {
  SupplierlogInForm!: FormGroup;
  selectedLanguage = "en";
  isRtl: boolean = false;
  logInDetails: any;
  // Ensure currentTab is typed as one of the keys
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

  isPasswordVisible: boolean = false; // Flag to control password visibility
  getImplementationConfigDataRes: any;
  cachedData: any;

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    public commonService: CommonService,
    public loginService: LoginService,
    public dialog: MatDialog,
    public admin: AdminService,
    private elementRef: ElementRef,
    public adminService: AdminService,
    public route: Router,
    // public supplierUser: SupplierUserFormService,
    private sessionTimeoutService: SessionTimeoutService
  ) {
    this.sessionTimeoutService.stopSessionTimeout();
  }
  // Toggle Select All
  toggleSelectAll(event: any) {
    this.selectAllChecked = event.checked;

    if (this.selectAllChecked) {
      this.selectedIndexes = new Set(this.document.map((_, index) => index));
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
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle visibility
  }
  switchLanguage(language: string) {
    // this.translate.use(language);
    //document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; // Change text direction
    this.isRtl = language === "ar"; // Set RTL if Arabic
    this.languageService.setLanguage(language); // Update language in service
  }
  // Login and MFA code

  login_custom() {
    this.route.navigate(["/krya/dashboard-menu"]);
  }
  login() {
    const login = {
      emailOrUsername: this.SupplierlogInForm.value.userName,
      password: this.SupplierlogInForm.value.passWord,
    };

    this.loginService.getJwtToken(login).subscribe({
      next: (res) => {
        if (res) {
          localStorage.setItem("JwtToken", res?.token);

          this.SupplierlogInForm.get("mfaCode")?.clearValidators();
          this.SupplierlogInForm.get("mfaCode")?.updateValueAndValidity();
          if (this.SupplierlogInForm.valid) {
            this.logInDetails = [];
            this.commonService.userName = this.SupplierlogInForm.value.userName;
            const logInInfo = this.SupplierlogInForm.value;
            this.loginService.logIn(logInInfo).subscribe((res: any) => {
              if (res.success == true) {
                localStorage.setItem("loginDetails", JSON.stringify(res));
                this.logInDetails = res;
                this.commonService.SupplierId = res.supplierId;
                this.commonService.UserId = res.userId;
                // this.dateTimeService._format = 'dd:MM;YY'
                // this.dateTimeService.setDateFormat();
                this.loginService.getScurity().subscribe((resData: any) => {
                  if (!resData?.enableOTPFlag) {
                    if (res?.userType === 1) {
                      this.route.navigate(["/krya/dashboard-menu"], {
                        queryParams: {
                          ImplementConfig: JSON.stringify(
                            this.getImplementationConfigDataRes
                          ),
                        },
                        skipLocationChange: true,
                        replaceUrl: true,
                      });
                    } else if (res.supplierCompletedFlag === true) {
                      this.route.navigate(["/krya/dashboard"], {
                        queryParams: {
                          ImplementConfig: JSON.stringify(
                            this.getImplementationConfigDataRes
                          ),
                        },
                        skipLocationChange: true,
                        replaceUrl: true,
                      });
                    } else if (res?.userType === 2) {
                      this.route.navigate(["/SupplierUserForm"], {
                        skipLocationChange: true,
                        replaceUrl: true,
                      });
                    } else if (res?.userType === 3) {
                      this.route.navigate(["/ProcureZen"]);
                    }
                  } 
                });
       
              } else {
                this.adminService.showMessage(res.message);
              }
            });
          } else {
            this.adminService.showMessage("Please enter username and password");
          }
        }
      },
    });
  }
  registrationPopUp() {
    if (this.agreeDownloadCenter == true) {
      // load the docment before open pop up
      this.dialog.open(SupplierRegistrationComponent, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: "",
        autoFocus: true,
        width: "85%",
        height: "85%",
        position: {
          top: "calc(1vw + 20px)",
          bottom: "",
          left: "",
          right: "",
        },
        panelClass: "popUpMiddle",
      });
    } else {
      this.adminService.showMessage(
        "Please agree to pre requisites guidelines and sign up"
      );
    }
  }
  ForgotPasswordPopUp() {
    this.dialog.open(ForgotPasswordComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: "",
      autoFocus: true,
      width: "30%",
      height: "50%",
      position: {
        top: "calc(7vw + 50px)",
        bottom: "",
        left: "",
        right: "",
      },
      // data: { logInDetails: this.logInDetails },  // Pass userId to the child component
      panelClass: "forgot-popup",
    });
  }
  onForgotPswdSubmit() {
    this.ForgotPasswordPopUp();
  }
  // end
}





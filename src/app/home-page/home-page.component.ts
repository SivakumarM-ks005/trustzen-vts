import { Component, ElementRef, HostListener, inject, Renderer2, ViewChild } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel, MatError, MatSuffix } from "@angular/material/form-field";
import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { SupplierRegistrationComponent } from "../supplier-registration/supplier-registration.component";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LanguageService } from "../core/services/language/language.service";
import { CommonService } from "../core/services/common.service";
import { Router } from "@angular/router";
import { ForgotPasswordComponent } from "../auth-module/forgot-password/forgot-password.component";
import { NgClass, NgIf, NgFor } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatButton, MatIconButton } from "@angular/material/button";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { LoginService } from "../core/services/login/login.service";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  standalone: true,
  imports: [
    NgClass, MatFormField, MatLabel, MatToolbarModule, MatTooltip, MatSelect, MatOption, MatCheckbox, 
    FormsModule, ReactiveFormsModule, MatInput, MatError, MatIcon, MatSuffix, NgIf, MatButton, MatDialogTitle, 
    MatIconButton, MatDialogClose, CdkScrollable, MatDialogContent, NgFor, MatDialogActions, MatTabGroup, MatTab
  ]
})
export class HomePageComponent {
  SupplierlogInForm!: FormGroup;
  selectedLanguage = "en";
  isRtl: boolean = false;
  logInDetails: any;
  agreeDownloadCenter: boolean = false;
  showMFA: boolean = false;
  copyrightFooter: any;
  document: any[] = [];
  selectedFilePaths: string[] = [];
  selectedIndexes: Set<number> = new Set();
  selectAllChecked: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    public commonService: CommonService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    public route: Router
  ) {}

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
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  switchLanguage(language: string) {
    this.isRtl = language === "ar";
    this.languageService.setLanguage(language);
  }

  login_custom() {
    this.route.navigate(["/krya/dashboard-menu"]);
  }

  registrationPopUp() {
    if (this.agreeDownloadCenter) {
      this.dialog.open(SupplierRegistrationComponent, {
        disableClose: true,
        hasBackdrop: true,
        autoFocus: true,
        width: "85%",
        height: "85%",
        position: { top: "calc(1vw + 20px)" },
        panelClass: "popUpMiddle"
      });
    }
  }

  ForgotPasswordPopUp() {
    this.dialog.open(ForgotPasswordComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: true,
      width: "30%",
      height: "50%",
      position: { top: "calc(7vw + 50px)" },
      panelClass: "forgot-popup"
    });
  }

  onForgotPswdSubmit() {
    this.ForgotPasswordPopUp();
  }
}

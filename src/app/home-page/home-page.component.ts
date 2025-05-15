import { Component, ElementRef, HostListener, inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';

import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

import { Router } from '@angular/router';


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

import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  standalone: true,
  imports: [NgClass, MatFormField, MatLabel, MatToolbarModule, MatTooltip, MatSelect, MatOption, ScrollPanelModule, MatCheckbox, FormsModule, ReactiveFormsModule, MatInput, MatError, MatIcon, MatSuffix, NgIf, MatButton, MatDialogTitle, MatIconButton, MatDialogClose, CdkScrollable, MatDialogContent, NgFor, MatDialogActions, MatTabGroup, MatTab, MatPaginator, TranslatePipe]
})

export class HomePageComponent {
 
}
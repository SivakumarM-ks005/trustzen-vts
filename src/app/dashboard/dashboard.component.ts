import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { Router } from '@angular/router';
import { NgIf, DatePipe } from '@angular/common';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgGridModule} from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [NgIf, MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardActions, MatLabel, MatButton, MatTooltip, DatePipe,
    MatCheckboxModule, FormsModule, AgGridModule]
})

export class DashboardComponent implements OnInit {
  SupDetails: any;
  constructor(public commonService: CommonService,
    public router: Router,
    public SupplierUserForm: SupplierUserFormService
  ) { }

  ngOnInit(): void {
  }

  SupplierRegNavigate(status: any) {
    this.router.navigate([`/krya/dashboardSupReg/status/In-Progress`], { skipLocationChange: true, replaceUrl: true });
  }

}

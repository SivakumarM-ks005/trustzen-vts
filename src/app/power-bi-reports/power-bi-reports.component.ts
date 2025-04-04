import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '@app/core/services/common.service';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-power-bi-reports',
  standalone: true,
  imports: [],
  templateUrl: './power-bi-reports.component.html',
  styleUrl: './power-bi-reports.component.scss'
})
export class PowerBiReportsComponent implements OnInit, OnDestroy {

  @ViewChild('reportContainer', { static: true }) reportContainer!: ElementRef;
  private apiUrl = 'http://192.168.108.200:8083/api/Supplier/Audit/GetPowerBIReportDetails';
  private report?: pbi.Embed;
  powerBiValue: any;
  //Inject Service
  cService = inject(CommonService);
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadReport();
  }

  private loadReport(): void {
    if (!window['powerbi']) {
      console.error("Power BI client library is not loaded!");
      return;
    }

    const powerbi = window['powerbi'];

    this.cService.getPowerBiData().subscribe((response: any) => {
      this.powerBiValue = response;
      const embedConfig: pbi.IEmbedConfiguration = {
        type: response.type,
        id: response.reportid,
        embedUrl: response.embedUrl,
        accessToken: response.accessToken,
        tokenType: pbi.models.TokenType.Embed,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: true,
        }
      };

      // Reset any previous embeddings
      powerbi.reset(this.reportContainer.nativeElement);

      // Embed the report
      this.report = powerbi.embed(this.reportContainer.nativeElement, embedConfig);

      this.report.on('loaded', () => {
        console.log('Power BI Report Loaded Successfully');
      });

      this.report.on('error', (event: any) => {
        console.error('Error loading report:', event.detail);
      });
    }, error => {
      console.error('Error fetching Power BI report details:', error);
    });
  }

  ngOnDestroy(): void {
    if (this.report) {
      this.report.off('loaded');
      this.report.off('error');
    }
  }
}

import { Component } from '@angular/core';
import { PowerBiReportsComponent } from "../power-bi-reports/power-bi-reports.component";

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [PowerBiReportsComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {

}

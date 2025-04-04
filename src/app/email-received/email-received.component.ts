import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabLabel, MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-email-received',
  standalone: true,
  imports: [MatInputModule , MatToolbarModule, MatDialogModule, MatFormField, MatFormFieldModule, MatButtonModule,  MatIconModule, MatSuffix, MatTooltipModule, MatTabsModule],
  templateUrl: './email-received.component.html',
  styleUrl: './email-received.component.scss'
})
export class EmailReceivedComponent {

}

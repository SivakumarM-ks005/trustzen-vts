
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from '@app/core/services/shared/shared.service';

@Component({
  selector: 'dialog-uploaded-file-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  template: `
  
    <div class="sidebar navbar-nav toggled"  >
      <div class="close-icon">
          <div class="subHeading">{{info.header||'Purchase Requisition Documents'}}</div>
          <mat-icon (click)="closeDialog()" class="icon-close">
              <span class="material-icons-outlined">close</span>
          </mat-icon>
      </div>
   @for(file of files;let fileI =$index;track file;){
   <div class="upload-file-row">
          <div>
              <div class="d-flex flex-row align-items-top">
                  <div style="width: fit-content;" class="subHeading2 pe-1">{{fileI +1}}
                  </div>
                  <div class="subHeading2 col">
                      <div style="display: flex; align-items: center; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          <span class="me-1" style="flex-shrink: 1; overflow: hidden; text-overflow: ellipsis;" matTooltip="Tooltip">
                              {{file.name}}
                          </span>
                          @if(file?.size){
                            <small >({{shareService.calculateFileSize(file.size)}})</small>                            
                          
                          }
                      </div>
                  </div>
                  <div class="col-auto">                       
                      <button (click)="downloadFile(file)" class="btn btn-sm smBtn btn-download" matTooltip="Download File">
                          <span class="material-icons-outlined">file_download</span>
                      </button>
                      <button (click)="deleteFile(file)" class="btn btn-danger btn-sm smBtn" type="button" matTooltip="Delete File">
                          <span class="material-icons-outlined">delete</span>
                      </button>
                  </div>
              </div>
              
          </div>
          
      </div> 
   }
      
      
          
</div>

   
  `,
  styles: [`
  
  `]
})
export class DialogUploadedFileListComponent {
  
   info={
    header:''
   }
  files:any=[]
  constructor(
    public dialogRef: MatDialogRef<DialogUploadedFileListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { files: { name: string; url: string }[] },
    public shareService:SharedService,
  ) {

    this.files = [...data.files];
  }

  downloadFile(file:any) {
    // window.open(file.url, '_blank');
    this.downloadUploadedFile(file)
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
  downloadUploadedFile(file: any) {
    let url = file?.url;
     if(url){
       url =URL.createObjectURL(file);     
     }
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    closeDialog() {
      this.dialogRef.close(this.files); // Return updated files to directive
    }
}

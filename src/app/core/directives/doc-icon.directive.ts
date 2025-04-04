import { Directive, ElementRef, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { PopupComponent } from './popup.component';
import { DialogUploadedFileListComponent } from '../dialogs/dialog-uploaded-file-list/dialog-uploaded-file-list.component';

@Directive({
  selector: '[appDocIcon]',
  standalone: true,
})
export class DocIconDirective {
  @Input() files: { name: string; url: string }[] = [];
  @Input() info={header:''};
  
  @Output() filesChange = new EventEmitter<any[]>(); // Emits changes

  constructor(
    private el: ElementRef,
    private dialog: MatDialog
  ) {}

  @HostListener('click') onClick() {
    this.openDialog();
  }

  private openDialog() {
    const rect = this.el.nativeElement.getBoundingClientRect(); // Get the position of the host element

    const dialogRef = this.dialog.open(DialogUploadedFileListComponent, {
      data: { files: this.files,info:this.info },
      width: '300px',
      minHeight: '150px',
      panelClass: 'upload-dialog',
      position: {
        top: `${rect.bottom + 5}px`, // 5px below the element
        left: `${rect.left -260}px` // Align with the left of the element
      }
    });
  // const dialogRef=  this.dialog.open(DialogUploadedFileListComponent, {
  //     data: { files: this.files },
  //     width: '300px',
  //     height: '300px',
  //     panelClass: 'custom-dialog'
  //   });
    dialogRef.afterClosed().subscribe((updatedFiles) => {
      if (updatedFiles) {
        this.files = updatedFiles;  // Update files when dialog closes
        this.filesChange.emit(this.files); // Emit changes
      }
    });
  }
}


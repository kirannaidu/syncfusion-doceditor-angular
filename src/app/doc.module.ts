import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DocumentEditorContainerAllModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocAppComponent } from './doc.component';
import { PdfViewerModule } from '@syncfusion/ej2-angular-pdfviewer';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  declarations: [
    DocAppComponent
  ],
  exports: [DocAppComponent],
  imports: [
    BrowserModule,
    DocumentEditorContainerAllModule,
    PdfViewerModule, ToolbarModule, DialogModule
  ],
  providers: [],
  bootstrap: [DocAppComponent]
})
export class DocModule { }

import { createElement, Event, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { DocumentEditor, FormatType } from '@syncfusion/ej2-angular-documenteditor';
import { Button } from '@syncfusion/ej2-angular-buttons';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    PdfViewerComponent, LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
    ToolbarService,  NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, LoadEventArgs, FormFieldsService, FormDesignerService
  } from '@syncfusion/ej2-angular-pdfviewer';


/**
 * Represents document editor title bar.
 */
export class TitleBar {
    private tileBarDiv: HTMLElement;
    private documentTitle: HTMLElement;
    private documentTitleContentEditor: HTMLElement;
    private export: DropDownButton;
    private print: Button;
    private open: Button;
    private exportBtn: Button;
    private documentEditor: DocumentEditor;
    private isRtl: boolean;
    private http: HttpClient;
    constructor(element: HTMLElement, docEditor: DocumentEditor, isShareNeeded: Boolean, isRtl?: boolean) {
        this.isRtl = isRtl;
        //initializes title bar elements.
        this.tileBarDiv = element;
        this.documentEditor = docEditor;
        this.initializeTitleBar(isShareNeeded);
        this.wireEvents();
    }
    private initializeTitleBar = (isShareNeeded: Boolean): void => {
        let downloadText: string;
        let downloadToolTip: string;
        let printText: string;
        let printToolTip: string;
        let openText: string;
        let exportBtnText: string;
        let documentTileText: string;
        downloadText = 'Download';
        downloadToolTip = 'Download this document.';
        printText = 'Print';
        printToolTip = 'Print this document (Ctrl+P).';
        openText = 'Open';
        exportBtnText = 'Export';
        documentTileText = 'Document Name. Click or tap to rename this document.';
        // tslint:disable-next-line:max-line-length
        this.documentTitle = createElement('label', { id: 'documenteditor_title_name', styles: 'font-weight:400;text-overflow:ellipsis;white-space:pre;overflow:hidden;user-select:none;cursor:text' });
        let iconCss: string = 'e-de-padding-right';
        let btnFloatStyle: string = 'float:right;';
        let titleCss: string = '';
        if (this.isRtl) {
            iconCss = 'e-de-padding-right-rtl';
            btnFloatStyle = 'float:left;';
            titleCss = 'float:right;';
        }
        // tslint:disable-next-line:max-line-length
        this.documentTitleContentEditor = createElement('div', { id: 'documenteditor_title_contentEditor', className: 'single-line', styles: titleCss });
        this.documentTitleContentEditor.appendChild(this.documentTitle);
        this.tileBarDiv.appendChild(this.documentTitleContentEditor);
        this.documentTitleContentEditor.setAttribute('title', 'Document Name. Click or tap to rename this document.');
        let btnStyles: string = btnFloatStyle + 'background: transparent;box-shadow:none; font-family: inherit;border-color: transparent;'
            + 'border-radius: 2px;color:inherit;font-size:12px;text-transform:capitalize;margin-top:4px;height:28px;font-weight:400;'
            + 'margin-top: 2px;';
        // tslint:disable-next-line:max-line-length
        this.print = this.addButton('e-de-icon-Print ' + iconCss, printText, btnStyles, 'de-print', printToolTip, false) as Button;
        this.open = this.addButton('e-de-icon-Open ' + iconCss, openText, btnStyles, 'de-open', documentTileText, false) as Button;
        this.exportBtn = this.addButton('e-de-icon-Open ' + iconCss, exportBtnText, btnStyles, 'de-open', documentTileText, false) as Button;
        let items: ItemModel[] = [
            { text: 'Microsoft Word (.docx)', id: 'word' },
            { text: 'Syncfusion Document Text (.sfdt)', id: 'sfdt' },
        ];
        // tslint:disable-next-line:max-line-length
        this.export = this.addButton('e-de-icon-Download ' + iconCss, downloadText, btnStyles, 'documenteditor-share', downloadToolTip, true, items) as DropDownButton;
        if (!isShareNeeded) {
            this.export.element.style.display = 'none';
            this.exportBtn.element.style.display = 'block';
        } else {
            this.open.element.style.display = 'none';
        }
    }
    private setTooltipForPopup(): void {
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-share-popup').querySelectorAll('li')[0].setAttribute('title', 'Download a copy of this document to your computer as a DOCX file.');
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-share-popup').querySelectorAll('li')[1].setAttribute('title', 'Download a copy of this document to your computer as an SFDT file.');
    }
    private wireEvents = (): void => {
        this.print.element.addEventListener('click', this.onPrint);
        this.open.element.addEventListener('click', (e: Event) => {
            if ((e.target as HTMLInputElement).id === 'de-open') {
                let fileUpload: HTMLInputElement = document.getElementById('uploadfileButton') as HTMLInputElement;
                fileUpload.value = '';
                fileUpload.click();
            }
        });
        this.documentTitleContentEditor.addEventListener('keydown', (e: KeyboardEventArgs) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                this.documentTitleContentEditor.contentEditable = 'false';
                if (this.documentTitleContentEditor.textContent === '') {
                    this.documentTitleContentEditor.textContent = 'Document1';
                }
            }
        });
        this.documentTitleContentEditor.addEventListener('blur', (): void => {
            if (this.documentTitleContentEditor.textContent === '') {
                this.documentTitleContentEditor.textContent = 'Document1';
            }
            this.documentTitleContentEditor.contentEditable = 'false';
            this.documentEditor.documentName = this.documentTitle.textContent;
        });
        this.documentTitleContentEditor.addEventListener('click', (): void => {
            this.updateDocumentEditorTitle();
        });
        this.exportBtn.element.addEventListener('click', (): void => {
            this.save('Docx');
        });
    }
    private updateDocumentEditorTitle = (): void => {
        this.documentTitleContentEditor.contentEditable = 'true';
        this.documentTitleContentEditor.focus();
        window.getSelection().selectAllChildren(this.documentTitleContentEditor);
    }
    // Updates document title.
    public updateDocumentTitle = (): void => {
        if (this.documentEditor.documentName === '') {
            this.documentEditor.documentName = 'Untitled';
        }
        this.documentTitle.textContent = this.documentEditor.documentName;
    }
    public getHeight(): number {
        return this.tileBarDiv.offsetHeight + 4;
    }
    // tslint:disable-next-line:max-line-length
    private addButton(iconClass: string, btnText: string, styles: string, id: string, tooltipText: string, isDropDown: boolean, items?: ItemModel[]): Button | DropDownButton {
        let button: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        this.tileBarDiv.appendChild(button);
        button.setAttribute('title', tooltipText);
        if (isDropDown) {
            // tslint:disable-next-line:max-line-length
            let dropButton: DropDownButton = new DropDownButton({ select: this.onExportClick, items: items, iconCss: iconClass, cssClass: 'e-caret-hide', content: btnText, open: (): void => { this.setTooltipForPopup(); } }, button);
            return dropButton;
        } else {
            let ejButton: Button = new Button({ iconCss: iconClass, content: btnText }, button);
            return ejButton;
        }
    }
    private onPrint = (): void => {
        this.documentEditor.print();
    }
    private onExportClick = (args: MenuEventArgs): void => {
        let value: string = args.item.id;
        switch (value) {
            case 'word':
                this.save('Docx');
                break;
            case 'sfdt':
                this.save('Sfdt');
                break;
        }
    }
    private save = (format: string): void => {
        // tslint:disable-next-line:max-line-length
        
    this.documentEditor.save(this.documentEditor.documentName === '' ? 'example' : this.documentEditor.documentName, format as FormatType);
   
    this.documentEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        // The blob can be processed further
        let formData: FormData = new FormData();
        formData.append('file', exportedDocument, 'postData.docx');
        this.sendPostRequest(formData)
    });
     
       
    }
    
    saveBlobToFile = (blob: Blob) => {
        // Create a temporary <a> element to download the Blob
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'document.docx';
      
        // Programmatically click the link to trigger the download
        link.click();
      
        // Clean up the temporary <a> element
        URL.revokeObjectURL(link.href);
      }
      
    public sendPostRequest = (formData: FormData) : void => {
        // Define the URL for the POST request
        // const url = 'https://jo95nwbsv5.execute-api.eu-west-1.amazonaws.com/dev/docs/';
        // const url = 'https://localhost:8000/Save';
        const url = 'http://localhost:5278/FileUpload/sampledoc/';
      
        // Define the request payload (data to be sent)
    
        // Define the headers (optional)
        const headers = new HttpHeaders({
          'Content-Type': ' multipart/form-data',
          'accept' : 'application/json'
        });
        
        
        // const formData = new FormData();
        // formData.append('file', file, 'postData.docx');
        
        // Send the POST request
        const xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open('POST', url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
              //console.log('Response:', xhr.responseText);
              // Handle the response data
            } else {
              console.error('Error:', xhr.statusText);
              // Handle the error
            }
          };
      
          // Set the onerror callback function
          xhr.onerror = () => {
            console.error('Error:', xhr.statusText);
            // Handle the error
          };
      
          // Send the request
          xhr.responseType = 'blob';
          xhr.send(formData);
      }
      
}

export class PDFTitleBar {
    private tileBarDiv: HTMLElement;
    private documentTitle: HTMLElement;
    private documentTitleContentEditor: HTMLElement;
    private export: DropDownButton;
    private print: Button;
    private open: Button;
    private exportBtn: Button;
    private pdfditor: PdfViewerComponent;
    private isRtl: boolean;
    private http: HttpClient;
    constructor(element: HTMLElement, docEditor:PdfViewerComponent,isShareNeeded: Boolean, isRtl?: boolean) {
        this.isRtl = isRtl;
        //initializes title bar elements.
        this.tileBarDiv = element;
        this.pdfditor = docEditor;
        this.initializeTitleBar(isShareNeeded);
        this.wireEvents();
    }
    private initializeTitleBar = (isShareNeeded: Boolean): void => {
       
        let openText: string;
        let exportBtnText: string;
        let documentTileText: string;
             openText = 'Open';
            exportBtnText = 'Export';
            documentTileText = 'Document Name. Click or tap to rename this document.';
        // tslint:disable-next-line:max-line-length
        this.documentTitle = createElement('label', { id: 'documenteditor_title_name', styles: 'font-weight:400;text-overflow:ellipsis;white-space:pre;overflow:hidden;user-select:none;cursor:text' });
        let iconCss: string = 'e-de-padding-right';
        let btnFloatStyle: string = 'float:right;';
        let titleCss: string = '';
        if (this.isRtl) {
            iconCss = 'e-de-padding-right-rtl';
            btnFloatStyle = 'float:left;';
            titleCss = 'float:right;';
        }
        // tslint:disable-next-line:max-line-length
        this.documentTitleContentEditor = createElement('div', { id: 'documenteditor_title_contentEditor', className: 'single-line', styles: titleCss });
        this.documentTitleContentEditor.appendChild(this.documentTitle);
        this.tileBarDiv.appendChild(this.documentTitleContentEditor);
        this.documentTitleContentEditor.setAttribute('title', 'Document Name. Click or tap to rename this document.');
        let btnStyles: string = btnFloatStyle + 'background: transparent;box-shadow:none; font-family: inherit;border-color: transparent;'
            + 'border-radius: 2px;color:inherit;font-size:12px;text-transform:capitalize;margin-top:4px;height:28px;font-weight:400;'
            + 'margin-top: 2px;';
        // tslint:disable-next-line:max-line-length
        this.exportBtn = this.addButton('e-de-icon-Open ' + iconCss, exportBtnText, btnStyles, 'de-open', documentTileText, false) as Button;
       
       
    }
   
    private wireEvents = (): void => {
        
        this.exportBtn.element.addEventListener('click', (): void => {
            this.save('PDF');
        });
    }
  
  
    // tslint:disable-next-line:max-line-length
    private addButton(iconClass: string, btnText: string, styles: string, id: string, tooltipText: string, isDropDown: boolean, items?: ItemModel[]): Button | DropDownButton {
        let button: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        this.tileBarDiv.appendChild(button);
        button.setAttribute('title', tooltipText);
       
            let ejButton: Button = new Button({ iconCss: iconClass, content: btnText }, button);
            return ejButton;
        
    }
    private save = (format: string): void => {
        // tslint:disable-next-line:max-line-length
        
    this.pdfditor.fileName = 'filename.pdf'
   
    this.pdfditor.saveAsBlob().then((exportedDocument: Blob) => {
        // The blob can be processed further
        let formData: FormData = new FormData();
        formData.append('file', exportedDocument, 'postData.pdf');
        this.sendPostRequest(formData);
        this.uploadPdf(formData);
    });
     
       
    }
   
    saveBlobToFile = (blob: Blob) => {
        // Create a temporary <a> element to download the Blob
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'document.docx';
      
        // Programmatically click the link to trigger the download
        link.click();
      
        // Clean up the temporary <a> element
        URL.revokeObjectURL(link.href);
      }
      
    public sendPostRequest = (formData: FormData) : void => {
        // Define the URL for the POST request
        // const url = 'https://jo95nwbsv5.execute-api.eu-west-1.amazonaws.com/dev/docs/';
        // const url = 'https://localhost:8000/Save';
        const url = 'http://localhost:5278/FileUpload/sampledoc/';
      
        // Define the request payload (data to be sent)
    
        // Define the headers (optional)
        const headers = new HttpHeaders({
          'Content-Type': ' multipart/form-data',
          'accept' : 'application/json'
        });
        
        
        // const formData = new FormData();
        // formData.append('file', file, 'postData.docx');
        
        // Send the POST request
        const xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open('POST', url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
              //console.log('Response:', xhr.responseText);
              // Handle the response data
            } else {
              console.error('Error:', xhr.statusText);
              // Handle the error
            }
          };
      
          // Set the onerror callback function
          xhr.onerror = () => {
            console.error('Error:', xhr.statusText);
            // Handle the error
          };
      
          // Send the request
          xhr.responseType = 'blob';
          xhr.send(formData);
      }
      
     public uploadPdf = (formData: FormData): void =>{
    // Set the headers for the request
        const headers = new Headers({'Content-Type': 'multipart/form-data',
        'Content-Disposition': `attachment; filename="${this.pdfditor.fileName}"`}) // Set the correct content type with boundary
       // Create the request options
      const options = {
        method: 'POST',
        headers: headers,
        body: formData
      };
      // Send the POST request
      try {
         fetch('https://localhost:5001/pdfviewer/FileUpload', options).then( response => {
          if (response.ok) {
          console.log('Request successful');
          // Handle the successful response
        } else {
          console.error('Request failed:', response.status);
          // Handle the failed response
        }
        
       })
       
      } catch (error) {
        console.error('Request error:', error);
        // Handle the request error
      }
      }  
      
}



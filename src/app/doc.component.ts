import { Component, ViewChild } from "@angular/core";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-angular-documenteditor";
import { PDFTitleBar, TitleBar } from "./title-bar";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import {
  PdfViewerComponent,
  LinkAnnotationService,
  BookmarkViewService,
  MagnificationService,
  ThumbnailViewService,
  ToolbarService,
  NavigationService,
  TextSearchService,
  TextSelectionService,
  PrintService,
  AnnotationService,
  LoadEventArgs,
  FormFieldsService,
  FormDesignerService,
} from "@syncfusion/ej2-angular-pdfviewer";

@Component({
  selector: "docvieweditor",
  templateUrl: "./doc.component.html",
  styleUrls: ["./doc.component.css"],
  providers: [
    LinkAnnotationService,
    BookmarkViewService,
    MagnificationService,
    ThumbnailViewService,
    ToolbarService,
    NavigationService,
    TextSearchService,
    TextSelectionService,
    PrintService,
    AnnotationService,
    FormFieldsService,
    FormDesignerService,
  ],
})
export class DocAppComponent {
  //Gets the DocumentEditorContainerComponent instance from view DOM using a template reference variable 'documenteditor_ref'.
  @ViewChild("documenteditor_ref")
  public container!: DocumentEditorContainerComponent;

  @ViewChild("pdfeditor_ref") public pdfviewerControl!: PdfViewerComponent;

  public Pdfservicelink: string = "https://localhost:5001/pdfviewer";
  public DocServiceLink: string = "https://localhost:8000/LoadDocument";
  public pdfdocument: string = "HandwrittenSignature.pdf";
  public serviceLink: string;
  titleBar: TitleBar;
  pdftitleBar: PDFTitleBar;
  public blob1: any;
  public IsDocx: boolean = true;
  public IsfileName: string = "postData.pdf";
  constructor() {
    this.serviceLink =
      // "https://services.syncfusion.com/angular/production/api/documenteditor/";
      "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/";
  }
  onCreate(): void {
    let titleBarElement: HTMLElement =
      document.getElementById("default_title_bar");
    this.titleBar = new TitleBar(
      titleBarElement,
      this.container.documentEditor,
      true
    );
    //Opens the default template Getting Started.docx from web API.
    this.openFile(".docx");
    this.container.documentEditor.documentName = "Test Data";
    this.titleBar.updateDocumentTitle();
    //Sets the language id as EN_US (1033) for spellchecker and docker image includes this language dictionary by default.
    //The spellchecker ensures the document content against this language.
    this.container.documentEditor.spellChecker.languageID = 1033;
    setInterval(() => {
      this.updateDocumentEditorSize();
    }, 100);
    //Adds event listener for browser window resize event.
    window.addEventListener("resize", this.onWindowResize);
  }

  onDocumentChange(): void {
    if (!isNullOrUndefined(this.titleBar)) {
      this.titleBar.updateDocumentTitle();
    }
    this.container.documentEditor.focusIn();
  }

  // Remove All Events
  onDestroy(): void {
    //Removes event listener for browser window resize event.
    window.removeEventListener("resize", this.onWindowResize);
  }

  // Window Resize
  onWindowResize = (): void => {
    //Resizes the document editor component to fit full browser window automatically whenever the browser resized.
    this.updateDocumentEditorSize();
  };

  // Drag & Drop / Resize
  updateDocumentEditorSize(): void {
    //Resizes the document editor component to fit full browser window.
    var windowWidth = window.innerWidth;
    //Reducing the size of title bar, to fit Document editor component in remaining height.
    var windowHeight = window.innerHeight - this.titleBar.getHeight();
    this.container.resize(windowWidth, windowHeight);
  }

  // S3 BBucket Upload & Import
  openFile(formatType: string): void {
    debugger
    // const s3Url = 'https://jo95nwbsv5.execute-api.eu-west-1.amazonaws.com/dev/docs/postData' + formatType
    const s3Url =
      "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB" +
      formatType;
    // const s3Url = 'http://localhost:5278/FileUpload/sampledoc/sample_doc.docx'
    fetch(s3Url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error: " + response.status);
        }
      })
      .then((data) => {
        const fileUrl = data;
        console.log("File URL:", fileUrl);

        // Handling the file URL
        fetch(fileUrl)
          .then((response) => response.blob())
          .then((blob) => {
            this.blob1 = blob;

            const reader = new FileReader();

            if (formatType === ".docx") {
              debugger
              reader.onloadend = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                const convertedBlob = new Blob([uint8Array], {
                  type: "application/docx",
                });

                this.blob1 = new Blob([blob], {
                  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                const url = window.URL.createObjectURL(this.blob1);

                const fileData = new Blob([convertedBlob]);
                const file = this.blob1.toString();
                const data = this.container.documentEditor.serialize();
                console.log(this.blob1);
                this.container.documentEditor.open(JSON.stringify(this.blob1));

                this.openTemplate();
                // Further processing with the JSON data

              };

              reader.readAsText(blob)
            } else {
              this.uploadPdf();
            }
            reader.readAsDataURL(blob);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Default Opened file
  openTemplate(): void {
    var uploadDocument = new FormData();
    console.log("this.blob1", this.blob1);
    uploadDocument.append("DocumentName", this.blob1);
    var loadDocumentUrl = this.serviceLink + "Import";
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", loadDocumentUrl, true);
    var dataContext = this;
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200 || httpRequest.status === 304) {
          //Opens the SFDT for the specified file received from the web API.
          dataContext.container.documentEditor.open(httpRequest.responseText);
        }
      }
    };
    //Sends the request with template file name to web API.
    httpRequest.send(uploadDocument);
  }

  // Backend Application Saving
  uploadPdf(): void {
    const formData = new FormData();
    formData.append("file", this.blob1, "postData.pdf");

    // Set the headers for the request

    const headers = new Headers({
      "Content-Type": "multipart/form-data",
      "Content-Disposition": `attachment; filename="${this.IsfileName}"`,
    }); // Set the correct content type with boundary

    // Create the request options

    const options = {
      method: "POST",
      headers: headers,
      body: formData,
    };
    // Send the POST request
    try {
      fetch("https://localhost:5001/pdfviewer/FileUpload", options).then(
        (response) => {
          if (response.ok) {
            console.log("Request successful");
            // Handle the successful response
          } else {
            console.error("Request failed:", response.status);
            // Handle the failed response
          }
        }
      );
    } catch (error) {
      console.error("Request error:", error);
      // Handle the request error
    }
  }

  // Default File viewer
  public documentLoad(e: LoadEventArgs): void {
    this.openFile(".pdf");

    let titleBarElement: HTMLElement =
      document.getElementById("default_title_bar");
    this.pdftitleBar = new PDFTitleBar(
      titleBarElement,
      this.pdfviewerControl,
      true
    );
    this.pdfviewerControl.annotationModule.setAnnotationMode(
      "HandWrittenSignature"
    );
  }
}

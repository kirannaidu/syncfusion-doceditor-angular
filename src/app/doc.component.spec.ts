import { TestBed } from '@angular/core/testing';
import { DocAppComponent } from './doc.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocAppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DocAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'doc-editor-app'`, () => {
    const fixture = TestBed.createComponent(DocAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('doc-editor-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DocAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('doc-editor-app app is running!');
  });
});

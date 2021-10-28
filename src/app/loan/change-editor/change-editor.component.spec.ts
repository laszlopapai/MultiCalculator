import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEditorComponent } from './change-editor.component';

describe('ChangeEditorComponent', () => {
  let component: ChangeEditorComponent;
  let fixture: ComponentFixture<ChangeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

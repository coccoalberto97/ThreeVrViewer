import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomVideoControlsComponent } from './custom-video-controls.component';

describe('CustomVideoControlsComponent', () => {
  let component: CustomVideoControlsComponent;
  let fixture: ComponentFixture<CustomVideoControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomVideoControlsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomVideoControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the componenet and it should contain a seek bar', () => {
    expect(component).toBeTruthy();
    expect(component.seekBar && component.seekBar.nativeElement).toBeTruthy();
  });
});

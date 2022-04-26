import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreeVrVideoComponent } from '../support/three-vr-video/three-vr-video.component';

import { ThreeVrViewerComponent } from './three-vr-viewer.component';

describe('ThreeVrViewerComponent', () => {
  let component: ThreeVrViewerComponent;
  let fixture: ComponentFixture<ThreeVrViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreeVrViewerComponent, ThreeVrVideoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeVrViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

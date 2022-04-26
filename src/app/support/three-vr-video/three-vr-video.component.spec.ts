import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ThreeVrVideoComponent } from './three-vr-video.component';

@Component({
  template: ` 
  <three-vr-video #videoref (onPause)="test($event)" (onPlay)="test($event)" (onTimeUpdate)="test($event)" #video
  [videoUrls]="videoUrls">
</three-vr-video>`
})
class TestHostThreeVrVideoComponent {
  @ViewChild(ThreeVrVideoComponent) videoref!: ThreeVrVideoComponent;
  videoUrls: string[] = ['https://threejs.org/examples/textures/pano.webm', 'https://threejs.org/examples/textures/pano.mp4'];
  test(event: any) {
    console.log(event);
  }
}

describe('ThreeVrVideoComponent', () => {
  //let component: ThreeVrVideoComponent;
  //let fixture: ComponentFixture<ThreeVrVideoComponent>;
  let component: TestHostThreeVrVideoComponent;
  let fixture: ComponentFixture<TestHostThreeVrVideoComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreeVrVideoComponent, TestHostThreeVrVideoComponent],
      teardown: { destroyAfterEach: false } // true by default after Angular 13
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostThreeVrVideoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create host component', () => {
    expect(component).toBeTruthy();
  });

  it('should check ThreeVrVideoComponent', () => {
    expect(component.videoref).toBeTruthy();
  });

  it('should check the video ref', () => {
    expect(component.videoref.video).toBeTruthy();
  });

  it('should check the video to be paused', () => {
    expect(component.videoref.video.paused).toBeTruthy();
  });
});

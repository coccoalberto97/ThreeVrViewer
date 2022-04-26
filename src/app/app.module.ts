import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeVrViewerComponent } from './three-vr-viewer/three-vr-viewer.component';
import { ThreeVrVideoComponent } from './support/three-vr-video/three-vr-video.component';
import { CustomVideoControlsComponent } from './support/debug/custom-video-controls/custom-video-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeVrViewerComponent,
    ThreeVrVideoComponent,
    CustomVideoControlsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

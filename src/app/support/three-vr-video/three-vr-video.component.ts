import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'three-vr-video[videoUrls]',
  templateUrl: './three-vr-video.component.html',
  styleUrls: ['./three-vr-video.component.scss']
})
export class ThreeVrVideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true })
  private videoRef_!: ElementRef;

  @Input() public videoUrls!: string[];

  public get video(): HTMLVideoElement {
    return this.videoRef_.nativeElement;
  }

  @Output() public onTimeUpdate: EventEmitter<any> = new EventEmitter();
  @Output() public onPlay: EventEmitter<any> = new EventEmitter();
  @Output() public onPause: EventEmitter<any> = new EventEmitter();
  @Output() public onSeeked: EventEmitter<any> = new EventEmitter();
  @Output() public onLoadedMetadata: EventEmitter<any> = new EventEmitter();
  @Output() public onCanPlay: EventEmitter<any> = new EventEmitter();
  /**
   * emitted when buffering
   */
  @Output() public onWaiting: EventEmitter<any> = new EventEmitter();

  private _playing: boolean = false;

  public get playing(): boolean {
    return this._playing;
  }

  private componentDestroyed: Subject<boolean> = new Subject();
  constructor() {

  }

  public ngAfterViewInit(): void {
    //setup listeners
    console.log(this.video);
    //todo delete ____to read event names easily
    //this.video.addEventListener("waiting")
    fromEvent(this.video, "timeupdate").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this.onTimeUpdate.next(event);
    });

    fromEvent(this.video, "play").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this._playing = true;
      this.onPlay.next(event);
    });

    fromEvent(this.video, "pause").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this._playing = false;
      this.onPause.next(event);
    });

    fromEvent(this.video, "seeked").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this.onSeeked.next(event);
    });

    fromEvent(this.video, "loadedmetadata").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this.onLoadedMetadata.next(event);
    });

    fromEvent(this.video, "canplay").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this.onCanPlay.next(event);
    });

    fromEvent(this.video, "waiting").pipe(takeUntil(this.componentDestroyed)).subscribe((event) => {
      this.onWaiting.next(event);
    });

    /*
    if (this.video.networkState === this.video.NETWORK_LOADING) {
      // The user agent is actively trying to download data.
    }

    if (this.video.readyState < this.video.HAVE_FUTURE_DATA) {
      // There is not enough data to keep playing from this point
    }*/
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  public play(): void {
    this.video.play();
  }

  public pause(): void {
    this.video.pause();
  }

  public togglePlay(): void {
    if (this._playing) {
      this.video.pause();
    } else {
      this.video.play();
    }
  }

  /**
   * Seek to the Percentage value
   * @param timeValue from 0 to 1
   */
  public setPlaybackPercentage(timeValue: number): void {
    //!timeValue check for null, isNaN(null) = false 
    if (!timeValue || isNaN(timeValue) || timeValue < 0 || timeValue > 1) {
      timeValue = 0;
    }

    this.video.currentTime = this.video.duration * timeValue;
  }

  /**
   * Seek to the Time in seconds
   * @param time time in seconds
   */
  public setPlaybackSeconds(time: number): void {
    if (!time || isNaN(time) || time < 0 || time > this.video.duration) {
      time = 0;
    }

    this.video.currentTime = time;
  }

  /**
   * Get the current time of the video
   * @returns the current time of the video in seconds
   */
  public getCurrentTime(): number {
    return this.video.currentTime;
  }

  /**
   * Get the current time of the video
   * @returns the current time of the video in seconds
   */
  public getDuration(): number {
    return this.video.duration || 1;
  }

}

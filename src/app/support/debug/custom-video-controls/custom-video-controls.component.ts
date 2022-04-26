import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'debug-video-controls[videoPlaying][seekValue]',
  templateUrl: './custom-video-controls.component.html',
  styleUrls: ['./custom-video-controls.component.scss']
})
export class CustomVideoControlsComponent implements OnInit, AfterViewInit {
  @ViewChild('seekBar', { static: true }) seekBar!: ElementRef<HTMLInputElement>;

  @Input() videoPlaying!: boolean;
  //should use setters to change value of the seekBar element but this is debug component so idc
  @Input() seekValue!: number;

  @Output() onPlay: EventEmitter<void> = new EventEmitter();
  @Output() onPause: EventEmitter<void> = new EventEmitter();
  @Output() onSeek: EventEmitter<number> = new EventEmitter();

  private wasPlayingBeforeSeek: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void { }

  public play(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onPlay.next();
  }

  public pause(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onPause.next();
  }

  public seekEnded(_event: Event): void {
    let nValue = parseFloat(this.seekBar.nativeElement.value);
    if (isNaN(nValue)) {
      //todo error
      return;
    }
    this.onSeek.emit(nValue);
    if (this.wasPlayingBeforeSeek) {
      this.onPlay.next();
    }
  }

  public seekStarted(_event: Event): void {
    this.wasPlayingBeforeSeek = this.videoPlaying;

    if (this.videoPlaying) {
      this.onPause.next();
    }
  }
}

import { Directive, Output, HostListener, EventEmitter } from '@angular/core';


@Directive({
  selector: '[dropZone]'
})
export class DropZoneDirective {

  @Output() dropped  =  new EventEmitter<FileList>();
  @Output() hovered =  new EventEmitter<boolean>();
  
  // @Output() open: EventEmitter<any> = new EventEmitter();
  // @Output() close: EventEmitter<any> = new EventEmitter();
  constructor() { }

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    // console.log($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    $event.preventDefault();
    // console.log($event);
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    $event.preventDefault();
    // console.log($event);
    this.hovered.emit(false);
  }

}

  import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

  @Directive({
    selector: '[dropzone]'
  })
  export class DropzoneDirective {

    @Output() onFileDropped = new EventEmitter<any>();

  // @HostBinding('style.opacity') private opacity = '1'

  
  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.opacity = '0.8'
  }
  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.opacity = '1'
  }
  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.opacity = '0.6'
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }

  }
}
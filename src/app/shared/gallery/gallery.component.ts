import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  imageFilenames: string[] = [];
  imageFilenames1: string[] = [];
  currentImage: string | null = null;
  constructor(
    
  ) {
    // this.currentImage = this.imageFilenames[0];
    // Generate image filenames from vanavihari-home-gallery-2.jpg to vanavihari-home-gallery-16.jpg
    for (let i = 2; i <= 16; i++) {
      this.imageFilenames.push(
        `assets/img/home-gallery/vanavihari-home-gallery-${i}.jpg`
      );
      this.imageFilenames1.push(
        `assets/img/home-gallery-junglestar/junglestar-home-gallery-${i}.jpg`
      );
    }
  }

  i = 0;

  slideIndex = 1;

  ngOnInit(): void {
    
  }
  
  settings = {
    counter: false,
    plugins: [lgZoom], // Include the lgZoom plugin
  };


}

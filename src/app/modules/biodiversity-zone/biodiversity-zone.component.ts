import { Component, Renderer2 } from '@angular/core';

import {
  Gallery,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-biodiversity-zone',
  templateUrl: './biodiversity-zone.component.html',
  styleUrls: ['./biodiversity-zone.component.scss'],
})
export class BiodiversityZoneComponent {
  title: any;
  showAnimals: boolean = true;
  showBirds: boolean = false;
  showTrees: boolean = false;
  animalsFilenames: any[];
  birdsFilenames: any[];
  treesFilenames: any[];

  awards: any[] = [];
  showLoader = false;
  resortTypeId: String;
  items: GalleryItem[] = [];

  constructor(
    private renderer: Renderer2,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) {
    this.showLoader = true;
    if (this.showAnimals) {
      this.title = 'Animals';
    }
    if (this.showBirds) {
      this.title = 'Birds';
    }
    if (this.showTrees) {
      this.title = 'Trees';
    }

    // Generate filenames for animals, birds, and trees
    this.animalsFilenames = this.generateFilenames(
      'animals/vana_animals_big_',
      15
    );
    this.birdsFilenames = this.generateFilenames('birds/vana_big_', 30);
    this.treesFilenames = this.generateFilenames('trees/', 42);
  }

  ngOnInit() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
    localStorage.setItem('booking_rooms', JSON.stringify([]));
  
  }

  generateFilenames(prefix: string, count: number): string[] {
    const filenames = [];
    for (let i = 1; i <= count; i++) {
      filenames.push(`assets/images/Bio Diversity Zone/${prefix}${i}.jpg`);
    }
    return filenames;
  }

  setImages(){
    const lightboxRef = this.gallery.ref('lightbox');
    if (this.resortTypeId == 'animals') {
      this.items = this.animalsFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }
    if ((this.resortTypeId == 'birds')) {
      this.items = this.birdsFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }
    if ((this.resortTypeId == 'trees')) {
      this.items = this.treesFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }

    const lightboxConfig = {
      closeIcon: `<img src="assets/images/icons/close.png">`,
      imageSize: ImageSize.Contain,
      thumbnails: null,
    };

    lightboxRef.setConfig(lightboxConfig);
    lightboxRef.load(this.items);
  }
  openLightbox(index: number, id: string) {
    this.resortTypeId = id;
    this.setImages();
    // this.lightbox.setConfig({
    //   closeIcon: `<img src="assets/images/icons/close.png">    `,
    // });
    // this.lightbox.open(index);
    this.lightbox.open(index);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }

  switchTitle() {
    if (this.showAnimals) {
      this.title = 'Awards';
    }
    if (this.showBirds) {
      this.title = 'News articles';
    }
  }
}

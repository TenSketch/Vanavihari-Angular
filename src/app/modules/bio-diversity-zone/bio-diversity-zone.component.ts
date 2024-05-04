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
  selector: 'app-bio-diversity-zone',
  templateUrl: './bio-diversity-zone.component.html',
  styleUrls: ['./bio-diversity-zone.component.scss'],
})
export class BioDiversityZoneComponent {
  resortTypeId: String;
  items: GalleryItem[] = [];
  animalsFilenames: any[];
  birdsFilenames: any[];
  treesFilenames: any[];

  showAnimals = true;
  showBirds = true;
  showTrees = true;

  title = ''
  constructor(
    private renderer: Renderer2,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) {}

  ngOnInit() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

  setData(index:any,id:any) {
    if (this.showAnimals) {
      this.items = this.animalsFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }
    if (this.birdsFilenames) {
      this.items = this.birdsFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }
    if (this.treesFilenames) {
      this.items = this.birdsFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }

    const lightboxRef = this.gallery.ref('lightbox');

    const lightboxConfig = {
      closeIcon: `<img src="assets/images/icons/close.png">`,
      imageSize: ImageSize.Contain,
      thumbnails: null,
    };

    lightboxRef.setConfig(lightboxConfig);
    lightboxRef.load(this.items);
    this.lightbox.open(index);
  }

  openLightbox(index: number, id: string) {
    this.resortTypeId = id;
    this.setData(index,id);
    this.lightbox.open(index);
  }

  switchTitle() {
    if (this.showAnimals) {
      this.title = 'Animals';
    }
    if (this.showBirds) {
      this.title = 'Birds';
    }
    if(this.showTrees){
      this.title = 'Trees'
    }
  }
}

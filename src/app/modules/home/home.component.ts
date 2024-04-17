import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import lgZoom from 'lightgallery/plugins/zoom';
// import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { UserService } from '../../user.service';
import {
  Gallery,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //user
  currentUser: string;
  // Define an array to hold the image filenames
  imageFilenames: string[] = [];
  imageFilenames1: string[] = [];
  currentImage: string | null = null;
  items: GalleryItem[] = [];
  resortTypeId:String

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) {
    for (let i = 2; i <= 16; i++) {
      this.imageFilenames.push(
        `assets/img/home-gallery/vanavihari-home-gallery-${i}.jpg`
      );
      this.imageFilenames1.push(
        `assets/img/home-gallery-junglestar/junglestar-home-gallery-${i}.jpg`
      );
    }
  }

  ngOnInit(): void {
    const lightboxRef = this.gallery.ref('lightbox');
    if (this.resortTypeId === 'vanavihari') {
      this.items = this.imageFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    } else {
      this.items = this.imageFilenames1.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Right,
    });
    lightboxRef.load(this.items);

    // Retrieve the logged-in user's data using the UserService
    const user = this.userService.getFullUser();
    this.currentUser = user ? user : '';
    console.log(this.currentUser);
    //alert('Registration successful!');
  }

  // settings = {
  //   counter: false,
  //   plugins: [lgZoom], // Include the lgZoom plugin
  // };

  // onBeforeSlide(detail: BeforeSlideDetail): void {
  //   const { index, prevIndex } = detail;
  //   // console.log(`Slide changed from ${prevIndex} to ${index}`);
  // }
  openLightbox(index: number, id: string) {
    this.resortTypeId = id;
    this.ngOnInit()
    this.lightbox.open(index);
  }
  
  goToVanavihari() {
    this.router.navigate(['/resorts/vanavihari-maredumilli']);
  }

  goToJungleStar() {
    this.router.navigate(['/resorts/vanavihari-maredumilli']);
  }
}

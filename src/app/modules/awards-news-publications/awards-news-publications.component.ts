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
  selector: 'app-awards-news-publications',
  templateUrl: './awards-news-publications.component.html',
  styleUrls: ['./awards-news-publications.component.scss'],
})
export class AwardsNewsPublicationsComponent {
  showAwards: boolean = true;
  showNews: boolean = false;
  title: any;
  imageFilenames: any[];
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
    if (this.showAwards) {
      this.title = 'Awards';
    }
    if (this.showNews) {
      this.title = 'News articles';
    }

    this.imageFilenames = [
      'assets/img/Awards and news.jpg',
      'assets/img/AWARDS AND NEWS (1).jpg',
      'assets/img/AWARDS AND NEWS (2).jpg',
    ];

    this.awards = [
      {
        header: 'Most Eco Friendly Tourism Award ',
        content:
          'Most Eco Friendly Tourism Award CBET Chairperson and Vice chairperson receiving the AP State Tourism Award 2010, Most Eco Friendly Tourism Award for the year 2010 from former Honorable Chief Minister Andhra Pradesh. ',
        image: 'assets/images/awards/0.jpg',
      },
      {
        header: 'Second National level convention Award ',
        content:
          'CBET Co-Ordinator receiving certificate of appreciation in Second National level convention on "Sustainable action and network through Community leaders programme" (SANCALP) organized by Indian Institute of Bio-Social Research and Development (IBRAD) Calcutta during the year 2011 ',
        image: 'assets/images/awards/1.jpg',
      },
      {
        header: 'Fifth National level convention Award ',
        content:
          'CBET Co-Ordinator receiving award for innovative programme in fifth National level convention on "Sustainable action and network through Community leaders programme" (SANCALP) organized by Indian Institute of Bio-Social Research and Development (IBRAD) Calcutta during the year 2015 ',
        image: 'assets/images/awards/2.jpg',
      },
      {
        header: 'Most Eco Friendly Tourism Award ',
        content:
          'CBET Chairperson, vice chairperson and co-ordinator receiving the AP State Tourism Award 2014, Most Eco Friendly Tourism Award for the year 2014 from Commissioner, Department of Tourism, Andhra Pradesh. ',
        image: 'assets/images/awards/3.jpg',
      },
      {
        header: 'Most Eco Friendly Tourism Award ',
        content:
          'CBET Chairperson and Vice chairperson receiving the AP State Tourism Award for Excellence – 2015-16, Most Eco Friendly Tourism Award for the year 2015-2016 from Honorable Chief Minister of Andhra Pradesh. ',
        image: 'assets/images/awards/4.jpg',
      },
    ];
  }

  ngOnInit() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
    localStorage.setItem('booking_rooms', JSON.stringify([]));
    const lightboxRef = this.gallery.ref('lightbox');
    if (this.resortTypeId === 'vanavihari') {
      this.items = this.imageFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    } else {
      this.items = this.imageFilenames.map(
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
    this.ngOnInit();
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
    if (this.showAwards) {
      this.title = 'Awards';
    }
    if (this.showNews) {
      this.title = 'News articles';
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor() {}

  bahuda(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/bahuda/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  bear(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/bear/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  bonnet(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/bonnet/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  bulbul(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/bulbul/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  chital(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/chital/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  chousingha(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/chousingha/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  hornbill(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/hornbill/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  kingfisher(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/kingfisher/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  narmada(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/narmada/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  pamuleru(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/pamuleru/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  panther(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/panther/';
    const imageFilenames = [
      'img-1.JPG',
      'img-2.JPG',
      'img-3.JPG',
      'img-4.JPG',
      'img-5.JPG',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  peacock(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/peacock/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  redjunglefowl(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/redjunglefowl/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  sambar(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/sambar/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  sokuleru(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/sokuleru/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  tapathi(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/tapathi/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  tribal(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/tribal/';
    const imageFilenames = [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  woodpecker(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/woodpecker/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  ambara(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/ambara/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
      'img-6.jpg',
      'img-7.jpg',
      'img-8.jpg',
      'img-9.jpg',
      'img-10.jpg',
      'img-11.jpg',
      'img-12.jpg',
      'img-13.jpg',
      'img-14.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }
  aditya(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/aditya/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  avani(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/avani/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }
  aranya(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/aranya/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
      'img-6.jpg',
      'img-7.jpg',
      'img-8.jpg',
      'img-9.jpg',
      'img-10.jpg',
      'img-11.jpg',
    ]; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  prakruti(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/prakruti/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  prana(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/prana/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  vanya(): string[] {
    // Assuming the images are located in the assets/images folder
    const imageFolder = 'assets/img/vanya/';
    const imageFilenames = ['img-1.jpg', 'img-2.jpg', 'img-3.jpg', 'img-4.jpg']; // Replace with actual filenames

    return imageFilenames.map((filename) => imageFolder + filename);
  }
  agathi(): string[] {
    const imageFolder = 'assets/img/agathi/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
      'img-6.jpg',
      'img-7.jpg',
    ];

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  vennela(): string[] {
    const imageFolder = 'assets/img/vennela/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
      'img-6.jpg',
      'img-7.jpg',
    ];

    return imageFilenames.map((filename) => imageFolder + filename);
  }

  jabilli(): string[] {
    const imageFolder = 'assets/img/jabilli/';
    const imageFilenames = [
      'img-1.jpg',
      'img-2.jpg',
      'img-3.jpg',
      'img-4.jpg',
      'img-5.jpg',
      'img-6.jpg',
      'img-7.jpg',
    ];

    return imageFilenames.map((filename) => imageFolder + filename);
  }
}

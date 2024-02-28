import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-resort',
  templateUrl: './search-resort.component.html',
  styleUrls: ['./search-resort.component.scss'],
})
export class SearchResortComponent {
  //searchbar model
  @ViewChild('modal') modal: ElementRef;
  adultsCount: number = 1;
  childrenCount: number = 0;
  isMaxReached: boolean = false;
  maxChildren: number = 10;
  roomsCount: number = 1;
  selectedAges: string[] = [];
  ageDropdowns: number[];

  constructor() {
    this.updateAgeDropdowns();
  }

  openModal() {
    const modal = this.modal.nativeElement;
    modal.classList.add('show');
    modal.style.display = 'block';
  }

  decrementAdults() {
    if (this.adultsCount > 1) {
      this.adultsCount--;
    }
  }

  incrementAdults() {
    this.adultsCount++;
  }

  incrementChildren() {
    if (this.childrenCount < this.maxChildren) {
      this.childrenCount++;
      this.selectedAges = Array(this.childrenCount).fill(''); // Add an empty string for the new dropdown
      this.isMaxReached = false;
    } else {
      this.isMaxReached = true;
    }
  }

  decrementChildren() {
    if (this.childrenCount > 0) {
      this.childrenCount--;
      this.selectedAges.pop(); // Remove the selected value for the last dropdown
      this.isMaxReached = false;
    }
  }
  getChildrenCountArray() {
    return Array(this.childrenCount)
      .fill(0)
      .map((x, i) => i);
  }

  decrementRooms() {
    if (this.roomsCount > 1) {
      this.roomsCount--;
    }
  }

  incrementRooms() {
    this.roomsCount++;
  }

  updateAgeDropdowns() {
    // Clear existing dropdowns
    this.ageDropdowns = [];
    // Create dropdowns for each child
    for (let i = 0; i < this.childrenCount; i++) {
      this.ageDropdowns.push(i); // Add a placeholder for each child
    }
    // Ensure the selectedAges array has the correct length
    while (this.selectedAges.length < this.childrenCount) {
      this.selectedAges.push(''); // Add empty strings for each child
    }
  }
}
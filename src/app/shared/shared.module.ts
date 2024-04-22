import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SearchResortComponent } from './search-resort/search-resort.component';

import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    BreadcrumbsComponent,
    GalleryComponent,
    SearchResortComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  exports: [GalleryComponent, SearchResortComponent],
})
export class SharedModule {}

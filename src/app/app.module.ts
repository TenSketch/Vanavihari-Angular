import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';


// MATERIAL
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from "@angular/material/core";
import { LightgalleryModule } from 'lightgallery/angular';


import { HomeComponent } from './modules/home/home.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { TouristPlacesComponent } from './modules/tourist-places/tourist-places.component';
import { AboutVanavihariComponent } from './modules/about-vanavihari/about-vanavihari.component';
import { VanavihariMaredumilliComponent } from './modules/resorts/vanavihari-maredumilli/vanavihari-maredumilli.component';
import { TribalCommunityComponent } from './modules/tribal-community/tribal-community.component';
import { AwardsNewsPublicationsComponent } from './modules/awards-news-publications/awards-news-publications.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './modules/terms-and-conditions/terms-and-conditions.component';
import { BiodiversityZoneComponent } from './modules/biodiversity-zone/biodiversity-zone.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { MyBookingsComponent } from './modules/my-bookings/my-bookings.component';
import { JungleStarValamuruComponent } from './modules/resorts/jungle-star-valamuru/jungle-star-valamuru.component';
import { ResortListingComponent } from './modules/resort-listing/resort-listing.component';
import { BookingSummaryComponent } from './modules/booking-summary/booking-summary.component';
import { TermsModalComponentComponent } from './modules/terms-modal-component/terms-modal-component.component';
import { ShowSuccessMessageComponent } from './auth/show-success-message/show-success-message.component';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { BookingSuccessfullComponent } from './modules/booking-successfull/booking-successfull.component';
import { RoomsComponent } from './modules/resorts/rooms/rooms.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    SignInComponent,
    SignUpComponent,
    TouristPlacesComponent,
    AboutVanavihariComponent,
    VanavihariMaredumilliComponent,
    TribalCommunityComponent,
    AwardsNewsPublicationsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    BiodiversityZoneComponent,
    SettingsComponent,
    MyBookingsComponent,
    JungleStarValamuruComponent,
    ResortListingComponent,
    BookingSummaryComponent,
    TermsModalComponentComponent,
    ShowSuccessMessageComponent,
    ChangePasswordComponent,
    BookingSuccessfullComponent,
    RoomsComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    LightgalleryModule,
    RouterModule,
    SharedModule,

  ],
  exports: [
    SharedModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
  ],

  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

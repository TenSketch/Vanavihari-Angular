import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
// import { HomeComponent } from './modules/under-construction/under-construction.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { TouristPlacesComponent } from './modules/tourist-places/tourist-places.component';
import { AboutVanavihariComponent } from './modules/about-vanavihari/about-vanavihari.component';
import { VanavihariMaredumilliComponent } from './modules/resorts/vanavihari-maredumilli/vanavihari-maredumilli.component';
import { JungleStarValamuruComponent } from './modules/resorts/jungle-star-valamuru/jungle-star-valamuru.component';
import { TribalCommunityComponent } from './modules/tribal-community/tribal-community.component';
import { AwardsNewsPublicationsComponent } from './modules/awards-news-publications/awards-news-publications.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './modules/terms-and-conditions/terms-and-conditions.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { MyBookingsComponent } from './modules/my-bookings/my-bookings.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { ResortListingComponent } from './modules/resort-listing/resort-listing.component';
import { BookingSummaryComponent } from './modules/booking-summary/booking-summary.component';
import { ShowSuccessMessageComponent } from './auth/show-success-message/show-success-message.component';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { BookingStatusComponent } from './modules/booking-status/booking-status.component';
import { BookingStatusTestComponent } from './modules/booking-status-test/booking-status-test.component';
import { RoomsComponent } from './modules/resorts/rooms/rooms.component';
import { ReadPaymentTransactionResponseComponent } from './auth/read-payment-transaction-response/read-payment-transaction-response.component';
import { PaymentPoliciesComponent } from './modules/payment-policies/payment-policies.component';
import { ContactUsComponent } from './modules/contact-us/contact-us.component';
import { BiodiversityZoneComponent } from './modules/biodiversity-zone/biodiversity-zone.component';
import { FoodMenuComponent } from './modules/food-menu/food-menu.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { TestRoomComponent } from './modules/test-room/test-room.component';
import { CancelRequestComponent } from './modules/cancel-request/cancel-request.component';
import { TestBookingsComponent } from './modules/test-bookings/test-bookings.component';
import { CancelStatusComponent } from './modules/cancel-status/cancel-status.component';
import { CancelRequestManualComponent } from './modules/cancel-request-manual/cancel-request-manual.component';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: HomeComponent },
  { path: 'sign-up', component: HomeComponent },
  { path: 'success', component: HomeComponent },
  {
    path: 'email-verification/:userid/:token',
    component: HomeComponent,
  },
  {
    path: 'payment-transaction-rdurl',
    component: HomeComponent,
  },
  { path: 'about-vanavihari', component: HomeComponent },
  { path: 'my-account/settings', component: HomeComponent },
  { path: 'my-account/my-bookings', component: HomeComponent },
  {
    path: 'resorts/vanavihari-maredumilli',
    component: HomeComponent,
  },
  {
    path: 'resorts/junglestar-valamuru',
    component: HomeComponent,
  },
  { path: 'tribal-community', component: HomeComponent },
  { path: 'privacy-policy', component: HomeComponent },
  { path: 'payment-policy', component: HomeComponent },
  { path: 'terms-and-conditions', component: HomeComponent },
  {
    path: 'awards-and-publications',
    component: HomeComponent,
  },
  {
    path: 'booking-summary',
    component: HomeComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  { path: 'booking-status', component: HomeComponent },
  { path: 'resorts/rooms', component: HomeComponent },
  { path: 'tourist-destination', component: HomeComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'resort-listing', component: HomeComponent },
  { path: 'change-password', component: HomeComponent },
  { path: 'contact-us', component: HomeComponent },
  { path: 'booking-status-test', component: HomeComponent },
  { path: 'biodiversity-zone', component: HomeComponent },
  { path: 'food-menu', component: HomeComponent },
  {
    path: 'resorts/test-rooms', component: HomeComponent
  },
  {
    path: 'forgot-password/:userid/:token',
    component: HomeComponent,
  },
  {
    path:'reset-password',
    component: HomeComponent,
  },
  {
    path:'cancel-request',
    component: HomeComponent,
  },
  {
    path:'cancel-request-manual',
    component: HomeComponent,
  },
  {
    path:'test-bookings',
    component: HomeComponent,
  },
  {
    path:'cancel-status',
    component:CancelStatusComponent
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

// const routes: Routes = [
//   { path: 'home', component: HomeComponent },
//   { path: 'sign-in', component: SignInComponent },
//   { path: 'sign-up', component: SignUpComponent },
//   { path: 'success', component: ShowSuccessMessageComponent },
//   {
//     path: 'email-verification/:userid/:token',
//     component: EmailVerificationComponent,
//   },
//   {
//     path: 'payment-transaction-rdurl',
//     component: ReadPaymentTransactionResponseComponent,
//   },
//   { path: 'about-vanavihari', component: AboutVanavihariComponent },
//   { path: 'my-account/settings', component: SettingsComponent },
//   { path: 'my-account/my-bookings', component: MyBookingsComponent },
//   {
//     path: 'resorts/vanavihari-maredumilli',
//     component: VanavihariMaredumilliComponent,
//   },
//   {
//     path: 'resorts/junglestar-valamuru',
//     component: JungleStarValamuruComponent,
//   },
//   { path: 'tribal-community', component: TribalCommunityComponent },
//   { path: 'privacy-policy', component: PrivacyPolicyComponent },
//   { path: 'payment-policy', component: PaymentPoliciesComponent },
//   { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
//   {
//     path: 'awards-and-publications',
//     component: AwardsNewsPublicationsComponent,
//   },
//   {
//     path: 'booking-summary',
//     component: BookingSummaryComponent,
//     canDeactivate: [CanDeactivateGuard],
//   },
//   { path: 'booking-status', component: BookingStatusComponent },
//   { path: 'resorts/rooms', component: RoomsComponent },
//   { path: 'tourist-destination', component: TouristPlacesComponent },
//   { path: 'dashboard', component: SettingsComponent },
//   { path: 'resort-listing', component: ResortListingComponent },
//   { path: 'change-password', component: ChangePasswordComponent },
//   { path: 'contact-us', component: ContactUsComponent },
//   { path: 'booking-status-test', component: BookingStatusTestComponent },
//   { path: 'biodiversity-zone', component: BiodiversityZoneComponent },
//   { path: 'food-menu', component: FoodMenuComponent },
//   {
//     path: 'resorts/test-rooms', component: TestRoomComponent
//   },
//   {
//     path: 'forgot-password/:userid/:token',
//     component: ForgotPasswordComponent,
//   },
//   {
//     path:'reset-password',
//     component: ResetPasswordComponent,
//   },
//   {
//     path:'cancel-request',
//     component: CancelRequestComponent,
//   },
//   {
//     path:'cancel-request-manual',
//     component: CancelRequestManualComponent,
//   },
//   {
//     path:'test-bookings',
//     component: TestBookingsComponent,
//   },
//   {
//     path:'cancel-status',
//     component:CancelStatusComponent
//   },
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: '**', redirectTo: '/home' },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

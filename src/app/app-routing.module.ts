import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'walkthrough',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'truckonly-signup',
    loadChildren: () => import('./pages/truckonly-signup/truckonly-signup.module').then( m => m.TruckonlySignupPageModule)
  },
  {
    path: 'walkthrough',
    loadChildren: () => import('./pages/walkthrough/walkthrough.module').then( m => m.WalkthroughPageModule)
  },
  {
    path: 'vendorsignup',
    loadChildren: () => import('./pages/vendorsignup/vendorsignup.module').then( m => m.VendorsignupPageModule)
  },
  {
    path: 'contactus',
    loadChildren: () => import('./pages/contactus/contactus.module').then( m => m.ContactusPageModule)
  },
  {
    path: 'tnc',
    loadChildren: () => import('./pages/tnc/tnc.module').then( m => m.TncPageModule)
  },
  {
    path: 'truckonly',
    loadChildren: () => import('./pages/truckonly/truckonly.module').then( m => m.TruckonlyPageModule)
  },
  {
    path: 'counter-input',
    loadChildren: () => import('./components/counter-input/counter-input.module').then( m => m.CounterInputPageModule)
  },
  {
    path: 'truckonly-step2',
    loadChildren: () => import('./pages/truckonly-step2/truckonly-step2.module').then( m => m.TruckonlyStep2PageModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./pages/aboutus/aboutus.module').then( m => m.AboutusPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'tnc-customer',
    loadChildren: () => import('./pages/tnc-customer/tnc-customer.module').then( m => m.TncCustomerPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'charitable',
    loadChildren: () => import('./pages/charitable/charitable.module').then( m => m.CharitablePageModule)
  },
  {
    path: 'donationitem',
    loadChildren: () => import('./pages/donationitem/donationitem.module').then( m => m.DonationitemPageModule)
  },
  {
    path: 'smallmove',
    loadChildren: () => import('./pages/smallmove/smallmove.module').then( m => m.SmallmovePageModule)
  },
  {
    path: 'smallmovepic',
    loadChildren: () => import('./pages/smallmovepic/smallmovepic.module').then( m => m.SmallmovepicPageModule)
  },
  {
    path: 'instructions',
    loadChildren: () => import('./pages/instructions/instructions.module').then( m => m.InstructionsPageModule)
  },
  {
    path: 'pickup',
    loadChildren: () => import('./pages/pickup/pickup.module').then( m => m.PickupPageModule)
  },
  {
    path: 'pickup-item',
    loadChildren: () => import('./pages/pickup-item/pickup-item.module').then( m => m.PickupItemPageModule)
  },
  {
    path: 'move',
    loadChildren: () => import('./pages/move/move.module').then( m => m.MovePageModule)
  },
  {
    path: 'movesecond',
    loadChildren: () => import('./pages/movesecond/movesecond.module').then( m => m.MovesecondPageModule)
  },
  {
    path: 'readme',
    loadChildren: () => import('./pages/readme/readme.module').then( m => m.ReadmePageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./pages/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'customer-profile-settings',
    loadChildren: () => import('./pages/customer-profile-settings/customer-profile-settings.module').then( m => m.CustomerProfileSettingsPageModule)
  },
  {
    path: 'movethird',
    loadChildren: () => import('./pages/movethird/movethird.module').then( m => m.MovethirdPageModule)
  },
  {
    path: 'move-video',
    loadChildren: () => import('./pages/move-video/move-video.module').then( m => m.MoveVideoPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'resources',
    loadChildren: () => import('./pages/resources/resources.module').then( m => m.ResourcesPageModule)
  },
  {
    path: 'vendororders',
    loadChildren: () => import('./pages/vendororders/vendororders.module').then( m => m.VendorordersPageModule)
  },
  {
    path: 'orderdetails',
    loadChildren: () => import('./pages/orderdetails/orderdetails.module').then( m => m.OrderdetailsPageModule)
  },
  {
    path: 'reportproblem',
    loadChildren: () => import('./pages/reportproblem/reportproblem.module').then( m => m.ReportproblemPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

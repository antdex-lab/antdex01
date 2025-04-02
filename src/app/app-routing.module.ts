import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from './dashboard/crm/crm.component';
import { AuthGuard } from './auth.guard';
import { RawBoxComponent } from './admin-app/raw-box/raw-box.component';
import { RawCardBoardComponent } from './admin-app/raw-card-board/raw-card-board.component';
import { RawCoreComponent } from './admin-app/raw-core/raw-core.component';
import { RawInkComponent } from './admin-app/raw-ink/raw-ink.component';
import { RawLabelComponent } from './admin-app/raw-label/raw-label.component';
import { RawPaperComponent } from './admin-app/raw-paper/raw-paper.component';
import { CuttingPlainComponent } from './roll-user/cutting-plain/cutting-plain.component';
import { CuttingPrintedComponent } from './roll-user/cutting-printed/cutting-printed.component';
import { PackingComponent } from './roll-user/packing/packing.component';
import { PrintingComponent } from './roll-user/printing/printing.component';
import { RollDisptachComponent } from './roll-user/roll-dispatch/roll-disptach.component';
import { SalaryTrackerComponent } from './salary-tracker/salary-tracker.component';
import { DisptachComponent } from './z-fold-user/dispatch/disptach.component';
import { ZFoldPackingComponent } from './z-fold-user/packing/z-fold-packing.component';
import { ZFoldComponent } from './z-fold-user/z-fold/z-fold.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import {CategoriesComponent} from "./admin-app/categories/categories.component";
import {OldStockComponent} from "./admin-app/old-stock/old-stock.component";

const routes: Routes = [
    { path: '', redirectTo: 'crm', pathMatch: 'full' },
    { path: 'crm', component: CrmComponent, canActivate: [AuthGuard] },
    { path: 'raw-paper', component: RawPaperComponent, canActivate: [AuthGuard] },
    { path: 'raw-core', component: RawCoreComponent, canActivate: [AuthGuard] },
    { path: 'raw-ink', component: RawInkComponent, canActivate: [AuthGuard] },
    { path: 'raw-label', component: RawLabelComponent, canActivate: [AuthGuard] },
    { path: 'raw-box', component: RawBoxComponent, canActivate: [AuthGuard] },
    { path: 'raw-cardboard', component: RawCardBoardComponent, canActivate: [AuthGuard] },

    { path: 'salary-tracker', component: SalaryTrackerComponent, canActivate: [AuthGuard] },

    { path: 'z-fold', component: ZFoldComponent, canActivate: [AuthGuard] },
    { path: 'z-fold-packing', component: ZFoldPackingComponent, canActivate: [AuthGuard] },
    { path: 'z-fold-dispatch', component: DisptachComponent, canActivate: [AuthGuard] },

    { path: 'printing', component: PrintingComponent, canActivate: [AuthGuard] },
    { path: 'cutting-plain', component: CuttingPlainComponent, canActivate: [AuthGuard] },
    { path: 'cutting-printed', component: CuttingPrintedComponent, canActivate: [AuthGuard] },
    { path: 'packing', component: PackingComponent, canActivate: [AuthGuard] },
    { path: 'roll-dispatch', component: RollDisptachComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
    { path: 'old-stock', component: OldStockComponent, canActivate: [AuthGuard] },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            { path: '', component: SignInComponent },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'lock-screen', component: LockScreenComponent },
            { path: 'confirm-email', component: ConfirmEmailComponent },
            { path: 'logout', component: LogoutComponent }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

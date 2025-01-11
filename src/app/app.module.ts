import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {BrowserModule, provideClientHydration,} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {ToDoListComponent} from './apps/to-do-list/to-do-list.component';
import {BoxComponent} from './dashboard/crm/boxs/box.component';
import {CardboardComponent} from './dashboard/crm/cardboards/cardboard.component';
import {ClientPaymentStatusComponent} from './dashboard/crm/client-payment-status/client-payment-status.component';
import {CoreComponent} from './dashboard/crm/cores/core.component';
import {EarningReportsComponent} from './dashboard/crm/earning-reports/earning-reports.component';
import {InkComponent} from './dashboard/crm/inks/ink.component';
import {LabelsComponent} from './dashboard/crm/labels/labels.component';
import {PaperRollsComponent} from './dashboard/crm/paper-rolls/paper-rolls.component';
import {RecentLeadsComponent} from './dashboard/crm/recent-leads/recent-leads.component';
import {StatsComponent} from './dashboard/crm/stats/stats.component';
import {TasksStatsComponent} from './dashboard/crm/tasks-stats/tasks-stats.component';
import {TopCustomersComponent} from './dashboard/crm/top-customers/top-customers.component';
import {TotalLeadsComponent} from './dashboard/crm/total-leads/total-leads.component';
import {SidebarComponent} from './common/sidebar/sidebar.component';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {HeaderComponent} from './common/header/header.component';
import {CrmComponent} from './dashboard/crm/crm.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {TotalRawBoxComponent} from './dashboard/crm/stats/total-raw-box/total-raw-box.component';
import {TotalRawCardboardComponent} from './dashboard/crm/stats/total-raw-cardboard/total-raw-cardboard.component';
import {TotalRawCoreComponent} from './dashboard/crm/stats/total-raw-core/total-raw-core.component';
import {TotalRawInkComponent} from './dashboard/crm/stats/total-raw-ink/total-raw-ink.component';
import {TotalRawLabelComponent} from './dashboard/crm/stats/total-raw-label/total-raw-label.component';
import {TotalRawPaperComponent} from './dashboard/crm/stats/total-raw-paper/total-raw-paper.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {ConfirmEmailComponent} from './authentication/confirm-email/confirm-email.component';
import {ForgotPasswordComponent} from './authentication/forgot-password/forgot-password.component';
import {LockScreenComponent} from './authentication/lock-screen/lock-screen.component';
import {LogoutComponent} from './authentication/logout/logout.component';
import {ResetPasswordComponent} from './authentication/reset-password/reset-password.component';
import {SignInComponent} from './authentication/sign-in/sign-in.component';
import {SignUpComponent} from './authentication/sign-up/sign-up.component';
import {RawBoxComponent} from './admin-app/raw-box/raw-box.component';
import {RawCardBoardComponent} from './admin-app/raw-card-board/raw-card-board.component';
import {RawCoreComponent} from './admin-app/raw-core/raw-core.component';
import {RawInkComponent} from './admin-app/raw-ink/raw-ink.component';
import {RawLabelComponent} from './admin-app/raw-label/raw-label.component';
import {RawPaperComponent} from './admin-app/raw-paper/raw-paper.component';
import {CuttingPlainComponent} from './roll-user/cutting-plain/cutting-plain.component';
import {CuttingPrintedComponent} from './roll-user/cutting-printed/cutting-printed.component';
import {PackingComponent} from './roll-user/packing/packing.component';
import {PrintingComponent} from './roll-user/printing/printing.component';
import {SalaryTrackerComponent} from './salary-tracker/salary-tracker/salary-tracker.component';
import {DisptachComponent} from './z-fold-user/dispatch/disptach.component';
import {ZFoldPackingComponent} from './z-fold-user/packing/z-fold-packing.component';
import {ZFoldComponent} from './z-fold-user/z-fold/z-fold.component';
import {HttpClientModule} from "@angular/common/http";
import {RollDisptachComponent} from "./roll-user/roll-dispatch/roll-disptach.component";
import {MaterialModule} from "./material.module";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        CrmComponent,
        StatsComponent,
        PaperRollsComponent,
        CoreComponent,
        InkComponent,
        LabelsComponent,
        BoxComponent,
        CardboardComponent,
        EarningReportsComponent,
        TasksStatsComponent,
        TopCustomersComponent,
        RecentLeadsComponent,
        ToDoListComponent,
        ClientPaymentStatusComponent,
        TotalLeadsComponent,
        TotalRawPaperComponent,
        TotalRawLabelComponent,
        TotalRawInkComponent,
        TotalRawCoreComponent,
        TotalRawBoxComponent,
        TotalRawCardboardComponent,
        AuthenticationComponent,
        SignInComponent,
        SignUpComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        LockScreenComponent,
        ConfirmEmailComponent,
        LogoutComponent,

        RawPaperComponent,
        RawCoreComponent,
        RawInkComponent,
        RawLabelComponent,
        RawBoxComponent,
        RawCardBoardComponent,
        SalaryTrackerComponent,
        ZFoldComponent,
        ZFoldPackingComponent,
        DisptachComponent,
        PrintingComponent,
        CuttingPlainComponent,
        CuttingPrintedComponent,
        PackingComponent,
        RollDisptachComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        NgScrollbarModule,
        RouterLinkActive,
        RouterModule,
        // NgClass,
        // NgIf,
        NgApexchartsModule,
        RouterOutlet,
        HttpClientModule,
        MaterialModule
    ],
    providers: [provideClientHydration()],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule { }

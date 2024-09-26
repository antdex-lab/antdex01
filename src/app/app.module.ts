import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    NgModule,
} from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import {
    BrowserModule,
    provideClientHydration,
} from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ToDoListComponent } from './apps/to-do-list/to-do-list.component';
import { BoxComponent } from './dashboard/crm/boxs/box.component';
import { CardboardComponent } from './dashboard/crm/cardboards/cardboard.component';
import { ClientPaymentStatusComponent } from './dashboard/crm/client-payment-status/client-payment-status.component';
import { CoreComponent } from './dashboard/crm/cores/core.component';
import { EarningReportsComponent } from './dashboard/crm/earning-reports/earning-reports.component';
import { InkComponent } from './dashboard/crm/inks/ink.component';
import { LabelsComponent } from './dashboard/crm/labels/labels.component';
import { PaperRollsComponent } from './dashboard/crm/paper-rolls/paper-rolls.component';
import { RecentLeadsComponent } from './dashboard/crm/recent-leads/recent-leads.component';
import { StatsComponent } from './dashboard/crm/stats/stats.component';
import { TasksStatsComponent } from './dashboard/crm/tasks-stats/tasks-stats.component';
import { TopCustomersComponent } from './dashboard/crm/top-customers/top-customers.component';
import { TotalLeadsComponent } from './dashboard/crm/total-leads/total-leads.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HeaderComponent } from './common/header/header.component';
import { CrmComponent } from './dashboard/crm/crm.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TotalRawBoxComponent } from './dashboard/crm/stats/total-raw-box/total-raw-box.component';
import { TotalRawCardboardComponent } from './dashboard/crm/stats/total-raw-cardboard/total-raw-cardboard.component';
import { TotalRawCoreComponent } from './dashboard/crm/stats/total-raw-core/total-raw-core.component';
import { TotalRawInkComponent } from './dashboard/crm/stats/total-raw-ink/total-raw-ink.component';
import { TotalRawLabelComponent } from './dashboard/crm/stats/total-raw-label/total-raw-label.component';
import { TotalRawPaperComponent } from './dashboard/crm/stats/total-raw-paper/total-raw-paper.component';

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
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        MatTooltipModule,
        MatFormFieldModule,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        NgScrollbarModule,
        MatExpansionModule,
        RouterLinkActive,
        RouterModule,
        NgClass,
        NgIf,
        NgApexchartsModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    providers: [provideClientHydration()],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule { }

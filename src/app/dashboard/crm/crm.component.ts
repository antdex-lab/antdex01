import { Component } from '@angular/core';
import { StatsComponent } from './stats/stats.component';

import { PaperRollsComponent } from './paper-rolls/paper-rolls.component';
import { CoreComponent } from './cores/core.component';
import { InkComponent } from './inks/ink.component';
import { LabelsComponent } from './labels/labels.component';
import { BoxComponent } from './boxs/box.component';
import { CardboardComponent } from './cardboards/cardboard.component';

import { EarningReportsComponent } from './earning-reports/earning-reports.component';
import { TasksStatsComponent } from './tasks-stats/tasks-stats.component';
import { TopCustomersComponent } from './top-customers/top-customers.component';
import { RecentLeadsComponent } from './recent-leads/recent-leads.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ClientPaymentStatusComponent } from './client-payment-status/client-payment-status.component';
import { TotalLeadsComponent } from './total-leads/total-leads.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-crm',
    standalone: true,
    imports: [
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
        RouterLink,
    ],
    templateUrl: './crm.component.html',
    styleUrl: './crm.component.scss',
})
export class CrmComponent {}

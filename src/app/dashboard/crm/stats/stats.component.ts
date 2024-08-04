import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TotalRawPaperComponent } from './total-raw-paper/total-raw-paper.component';
import { TotalRawCoreComponent } from './total-raw-core/total-raw-core.component';
import { TotalRawInkComponent } from './total-raw-ink/total-raw-ink.component';
import { TotalRawLabelComponent } from './total-raw-label/total-raw-label.component';
import { TotalRawBoxComponent } from './total-raw-box/total-raw-box.component';
import { TotalRawCardboardComponent } from './total-raw-cardboard/total-raw-cardboard.component';
@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, TotalRawPaperComponent, TotalRawLabelComponent, TotalRawInkComponent, TotalRawCoreComponent, TotalRawBoxComponent, TotalRawCardboardComponent],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent {}
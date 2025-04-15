import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DATE_FORMATS, MatNativeDateModule } from "@angular/material/core";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { MY_DATE_FORMATS } from "./common/pipe/DatePipe";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from "@angular/common";

@NgModule({
    declarations: [],
    imports: [
        MatTooltipModule,
        MatFormFieldModule,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioButton,
        MatRadioGroup,
        MatAutocompleteModule,
        AsyncPipe
    ],
    exports: [
        MatTooltipModule,
        MatFormFieldModule,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioButton,
        MatRadioGroup,
        MatAutocompleteModule,
        AsyncPipe
    ],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    ]
})

export class MaterialModule {
}

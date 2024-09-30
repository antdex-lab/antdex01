import {DatePipe, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './roll-disptach.component.html',
    styleUrl: './roll-disptach.component.scss'
})
export class RollDisptachComponent implements OnInit{

    displayedColumns: string[] = ['rollSize', 'noOfRollPerSize', 'orderBy', 'DateAndTime', 'action'];
    dataSource: any[] = [];

    rollDispatchForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.rollDispatchForm = this.fb.group({
            rollSize: [''],
            noOfRollPerSize: [''],
            orderBy: [''],
            DateAndTime: [new Date()]
        });
    }

    loadData() {
        this.service.getData('dispatchRolls').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.rollDispatchForm.valid) {
            const sendData = {
                rollSize: this.rollDispatchForm.value.rollSize,
                noOfRollPerSize: this.rollDispatchForm.value.noOfRollPerSize,
                orderBy: this.rollDispatchForm.value.orderBy,
                DateAndTime: this.rollDispatchForm.value.DateAndTime
            };

            if (!this.isEdit) {
                this.service.createData('dispatchRolls', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.rollDispatchForm.reset();
                    }
                });
            } else {
                this.service.updateData('dispatchRolls', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.rollDispatchForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.rollDispatchForm.setValue({
            rollSize: data.rollSize,
            noOfRollPerSize: data.noOfRollPerSize,
            orderBy: data.orderBy,
            DateAndTime: new Date(data.DateAndTime)
        });
    }

    deleteData(id: string) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.deleteData('dispatchRolls', id).subscribe((res) => {
                    if (res) {
                        Swal.fire(
                            'Deleted!',
                            'The core entry has been deleted.',
                            'success'
                        );
                        this.loadData();
                    }
                });
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // Implement the filtering logic if necessary.
    }

}

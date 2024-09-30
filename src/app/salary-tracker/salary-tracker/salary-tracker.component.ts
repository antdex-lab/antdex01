import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-raw-label',
    templateUrl: './salary-tracker.component.html',
    styleUrl: './salary-tracker.component.scss'
})
export class SalaryTrackerComponent implements OnInit{

    displayedColumns: string[] = ['name', 'salary', 'contact', 'address', 'department', 'dateOfJoining', 'action'];
    dataSource: any[] = [];

    cardBoardForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.cardBoardForm = this.fb.group({
            name: [''],
            salary: [''],
            contact: [''],
            address: [''],
            department: [''],
            dateOfJoining: [new Date()]
        });
    }

    loadData() {
        this.service.getData('salaries').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.cardBoardForm.valid) {
            const sendData = {
                name: this.cardBoardForm.value.name,
                salary: this.cardBoardForm.value.salary,
                contact: this.cardBoardForm.value.contact,
                address: this.cardBoardForm.value.address,
                department: this.cardBoardForm.value.department,
                dateOfJoining: this.cardBoardForm.value.dateOfJoining
            };

            if (!this.isEdit) {
                this.service.createData('salaries', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.cardBoardForm.reset();
                    }
                });
            } else {
                this.service.updateData('salaries', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.cardBoardForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.cardBoardForm.setValue({
            name: data.name,
            salary: data.salary,
            contact: data.contact,
            address: data.address,
            department: data.department,
            dateOfJoining: new Date(data.dateOfJoining)
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
                this.service.deleteData('salaries', id).subscribe((res) => {
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

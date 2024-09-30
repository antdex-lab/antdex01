import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {ApiService} from "../../../services/api.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-ink.component.html',
    styleUrl: './raw-ink.component.scss'
})
export class RawInkComponent implements OnInit {

    displayedColumns: string[] = ['color', 'sizeInKg', 'pricePerKg', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    inkForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadCores();
        this.inkForm = this.fb.group({
            color: [''],
            sizeInKg: [''],
            pricePerKg: [''],
            totalPrice: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadCores() {
        this.service.getData('inks').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submitCoreEntry() {
        if (this.inkForm.valid) {
            const sendData = {
                color: this.inkForm.value.color,
                sizeInKg: this.inkForm.value.sizeInKg,
                pricePerKg: Number(this.inkForm.value.pricePerKg),
                totalPrice: this.inkForm.value.totalPrice,
                dateOfEntry: this.inkForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('inks', sendData).subscribe((res) => {
                    if (res) {
                        this.loadCores();
                        this.inkForm.reset();
                    }
                });
            } else {
                this.service.updateData('inks', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadCores();
                        this.isEdit = false;
                        this.inkForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.inkForm.setValue({
            color: data.color,
            sizeInKg: data.sizeInKg,
            pricePerKg: data.pricePerKg,
            totalPrice: data.totalPrice,
            dateOfEntry: new Date(data.dateOfEntry)
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
                this.service.deleteData('inks', id).subscribe((res) => {
                    if (res) {
                        Swal.fire(
                            'Deleted!',
                            'The core entry has been deleted.',
                            'success'
                        );
                        this.loadCores();
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

import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {ApiService} from "../../../services/api.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-box.component.html',
    styleUrl: './raw-box.component.scss'
})
export class RawBoxComponent implements OnInit{

    displayedColumns: string[] = ['boxSize', 'boxCount', 'pricePerBox', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    boxForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.boxForm = this.fb.group({
            boxSize: [''],
            boxCount: [''],
            pricePerBox: [''],
            totalPrice: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        this.service.getData('boxs').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.boxForm.valid) {
            const sendData = {
                boxSize: this.boxForm.value.boxSize,
                boxCount: this.boxForm.value.boxCount,
                pricePerBox: this.boxForm.value.pricePerBox,
                totalPrice: this.boxForm.value.totalPrice,
                dateOfEntry: this.boxForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('boxs', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.boxForm.reset();
                    }
                });
            } else {
                this.service.updateData('boxs', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.boxForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.boxForm.setValue({
            boxSize: data.boxSize,
            boxCount: data.boxCount,
            pricePerBox: data.pricePerBox,
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
                this.service.deleteData('boxs', id).subscribe((res) => {
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

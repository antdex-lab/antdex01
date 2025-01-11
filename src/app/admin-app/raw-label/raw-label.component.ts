import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-label.component.html',
    styleUrl: './raw-label.component.scss'
})
export class RawLabelComponent implements OnInit{

    displayedColumns: string[] = ['rawMaterial', 'price', 'labelSize', 'labelCount', 'pricePerLabel', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    labelForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.labelForm = this.fb.group({
            rawMaterial: [''],
            price: [''],
            labelSize: [''],
            labelCount: [''],
            pricePerLabel: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        this.service.getData('labels').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.labelForm.valid) {
            const sendData = {
                rawMaterial: this.labelForm.value.rawMaterial,
                price: this.labelForm.value.price,
                labelSize: this.labelForm.value.labelSize,
                labelCount: this.labelForm.value.labelCount,
                pricePerLabel: this.labelForm.value.pricePerLabel,
                dateOfEntry: this.labelForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('labels', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.labelForm.reset();
                    }
                });
            } else {
                this.service.updateData('labels', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.labelForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.labelForm.setValue({
            rawMaterial: data.rawMaterial,
            price: data.price,
            labelSize: data.labelSize,
            labelCount: data.labelCount,
            pricePerLabel: data.pricePerLabel,
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
                this.service.deleteData('labels', id).subscribe((res) => {
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

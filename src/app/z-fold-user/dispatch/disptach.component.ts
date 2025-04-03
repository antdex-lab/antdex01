import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './disptach.component.html',
    styleUrl: './disptach.component.scss'
})
export class DisptachComponent implements OnInit {

    displayedColumns: string[] = ['packetModelPerSize', 'noOfpacket', 'orderBy', 'DateAndTime', 'action'];
    dataSource: any[] = [];

    zFoldForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.loadData();
        this.zFoldForm = this.fb.group({
            packetModelPerSize: [''],
            noOfpacket: [''],
            orderBy: [''],
            bill: [''],
            billNumber: [''],
            dispatchVia: [''],
            DateAndTime: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('dispatchZs').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        if (this.zFoldForm.valid) {
            const sendData = {
                packetModelPerSize: this.zFoldForm.value.packetModelPerSize,
                noOfpacket: this.zFoldForm.value.noOfpacket,
                orderBy: this.zFoldForm.value.orderBy,
                bill: this.zFoldForm.value.bill,
                billNumber: this.zFoldForm.value.billNumber,
                dispatchVia: this.zFoldForm.value.dispatchVia,
                DateAndTime: this.zFoldForm.value.DateAndTime
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('dispatchZs', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.zFoldForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('dispatchZs', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.zFoldForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.zFoldForm.patchValue({
            packetModelPerSize: data.packetModelPerSize,
            noOfpacket: data.noOfpacket,
            bill: data.bill,
            billNumber: data.billNumber,
            orderBy: data.orderBy,
            dispatchVia: data.dispatchVia,
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('dispatchZs', id).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
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

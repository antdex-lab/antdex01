import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './roll-disptach.component.html',
    styleUrl: './roll-disptach.component.scss'
})
export class RollDisptachComponent implements OnInit {

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
            noOfRollPackets: [''],
            rollSize: [''],
            noOfRollPerSize: [''],
            orderBy: [''],
            bill: [''],
            billNumber: [''],
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

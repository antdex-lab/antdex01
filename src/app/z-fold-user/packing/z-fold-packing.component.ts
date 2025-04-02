import {Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './z-fold-packing.component.html',
    styleUrl: './z-fold-packing.component.scss'
})
export class ZFoldPackingComponent implements OnInit{

    displayedColumns: string[] = ['cardBoardSize', 'printed', 'nonPrinted', 'noOfPacket', 'entryDate','action'];
    dataSource: any[] = [];

    zFoldPackingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(private service: ApiService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.loadData();
        this.zFoldPackingForm = this.fb.group({
            cardBoardSize: [''],
            printed: [''],
            nonPrinted: [''],
            noOfPacket: [''],
            entryDate: [new Date()]
        });
    }


    loadData() {
        this.service.getData('z-fold-packing').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.zFoldPackingForm.valid) {
            const sendData = {
                cardBoardSize: this.zFoldPackingForm.value.cardBoardSize,
                printed: this.zFoldPackingForm.value.printed,
                nonPrinted: this.zFoldPackingForm.value.nonPrinted,
                noOfPacket: this.zFoldPackingForm.value.noOfPacket,
                entryDate: this.zFoldPackingForm.value.entryDate
            };

            if (!this.isEdit) {
                this.service.createData('z-fold-packing', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.zFoldPackingForm.reset();
                    }
                });
            } else {
                this.service.updateData('z-fold-packing', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.zFoldPackingForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.zFoldPackingForm.patchValue({
            cardBoardSize: data.cardBoardSize,
            printed: data.printed,
            nonPrinted: data.nonPrinted,
            noOfPacket: data.noOfPacket,
            entryDate: new Date(data.entryDate)
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
                this.service.deleteData('z-fold-packing', id).subscribe((res) => {
                    if (res) {
                        Swal.fire(
                            'Deleted!',
                            'Deleted Successfully.',
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
    }

    // isToggled
    isToggled = false;
}

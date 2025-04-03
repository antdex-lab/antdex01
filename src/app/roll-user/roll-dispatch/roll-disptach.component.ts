import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './roll-disptach.component.html',
    styleUrl: './roll-disptach.component.scss'
})
export class RollDisptachComponent implements OnInit {

    displayedColumns: string[] = ['totalBoxDispatch', 'rollSizeWithLabel', 'orderBy', 'DateAndTime','dispatchVia', 'action'];
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
            totalBoxDispatch: [''],
            rollSizeWithLabel: [''],
            totalRolls: [''],
            orderBy: [''],
            bill: [''],
            billNumber: [''],
            dispatchVia: [''],
            DateAndTime: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('dispatchRolls').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        if (this.rollDispatchForm.valid) {
            const sendData = {
                totalBoxDispatch: this.rollDispatchForm.value.totalBoxDispatch,
                rollSizeWithLabel: this.rollDispatchForm.value.rollSizeWithLabel,
                totalRolls: this.rollDispatchForm.value.totalRolls,
                orderBy: this.rollDispatchForm.value.orderBy,
                bill: this.rollDispatchForm.value.bill,
                billNumber: this.rollDispatchForm.value.billNumber,
                dispatchVia: this.rollDispatchForm.value.dispatchVia,
                DateAndTime: this.rollDispatchForm.value.DateAndTime
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('dispatchRolls', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.rollDispatchForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('dispatchRolls', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
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

        this.rollDispatchForm.patchValue({
            totalBoxDispatch: data.totalBoxDispatch,
            rollSizeWithLabel: data.rollSizeWithLabel,
            totalRolls: data.totalRolls,
            orderBy: data.orderBy,
            bill: data.bill,
            billNumber: data.billNumber,
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
                this.service.deleteData('dispatchRolls', id).subscribe((res) => {
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


    downloadExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roll Dispatch Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Roll_Dispatch_Data.xlsx');
    }

}

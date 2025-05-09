import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

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
        this.loadData();
        this.inkForm = this.fb.group({
            color: ['', Validators.required],
            sizeInKg: ['', Validators.required],
            pricePerKg: ['', Validators.required],
            totalPrice: ['', Validators.required],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('inks').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
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
                LoadingSpinnerComponent.show();
                this.service.createData('inks', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.inkForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('inks', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
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

        this.inkForm.patchValue({
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('inks', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Ink Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Ink_Data.xlsx');
    }

    totalPrice() {
        const { sizeInKg, pricePerKg } = this.inkForm.value;

        if (sizeInKg && pricePerKg) {
            const total = Number(sizeInKg) * Number(pricePerKg);
            this.inkForm.patchValue({ totalPrice: total.toFixed(2) });
        }
    }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

@Component({
    selector: 'app-raw-core',
    templateUrl: './raw-core.component.html',
    styleUrl: './raw-core.component.scss'
})
export class RawCoreComponent implements OnInit {

    displayedColumns: string[] = ['noOfCores', 'size', 'pricePerCore', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    coreForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadCores();
        this.coreForm = this.fb.group({
            noOfCores: [''],
            size: [''],
            pricePerCore: [''],
            totalPrice: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadCores() {
        this.service.getData('cores').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submitCoreEntry() {
        if (this.coreForm.valid) {
            const sendData = {
                noOfCores: this.coreForm.value.noOfCores,
                size: this.coreForm.value.size,
                pricePerCore: Number(this.coreForm.value.pricePerCore),
                totalPrice: this.coreForm.value.totalPrice,
                dateOfEntry: this.coreForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('cores', sendData).subscribe((res) => {
                    if (res) {
                        this.loadCores();
                        this.coreForm.reset();
                    }
                });
            } else {
                this.service.updateData('cores', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadCores();
                        this.isEdit = false;
                        this.coreForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.coreForm.patchValue({
            noOfCores: data.noOfCores,
            size: data.size,
            pricePerCore: data.pricePerCore,
            totalPrice: data.totalPrice,
            dateOfEntry: new Date(data.dateOfEntry)
        });
    }

    deleteCore(id: string) {
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
                this.service.deleteData('cores', id).subscribe((res) => {
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


    downloadExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Core Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Core_Data.xlsx');
    }

    totalPrice() {
        const { noOfCores, pricePerCore } = this.coreForm.value;

        if (noOfCores && pricePerCore) {
            const total = Number(noOfCores) * Number(pricePerCore);
            this.coreForm.patchValue({ totalPrice: total.toFixed(2) });
        }
    }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown } from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './cutting-printed.component.html',
    styleUrl: './cutting-printed.component.scss'
})
export class CuttingPrintedComponent implements OnInit {

    displayedColumns: string[] = ['printingSizeAsPerPrintingRoll', 'inkUsed', 'countForRoll', 'totalRoll', 'cuttingDateOfEntry', 'action'];
    dataSource: any[] = [];

    printingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    dropdown: Dropdown;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.printingForm = this.fb.group({
            printingSizeAsPerPrintingRoll: [''],
            countForRoll: [''],
            inkUsed: [''],
            corePerRoll1: [''],
            coreSize1: [''],
            corePerRoll2: [''],
            coreSize2: [''],
            corePerRoll3: [''],
            coreSize3: [''],
            totalRoll: [''],
            cuttingDateOfEntry: [new Date()]
        });
    }


    loadDropdown() {
        this.service.getData('dropdown/category/ECG Roll Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                console.log(this.dropdown);
            }
        })
    }


    loadData() {
        this.service.getData('cuttings').subscribe((res) => {
            this.dataSource = res;
        });
    }

    calculateTotal(): void {
        const corePerRoll1 = Number(this.printingForm.get('corePerRoll1')?.value) || 0;
        const corePerRoll2 = Number(this.printingForm.get('corePerRoll2')?.value) || 0;
        const corePerRoll3 = Number(this.printingForm.get('corePerRoll3')?.value) || 0;

        const total = corePerRoll1 + corePerRoll2 + corePerRoll3;
        this.printingForm.get('totalRoll')?.setValue(total);
    }

    submit() {
        if (this.printingForm.valid) {
            const sendData = {
                printingSizeAsPerPrintingRoll: this.printingForm.value.printingSizeAsPerPrintingRoll,
                inkUsed: this.printingForm.value.inkUsed,
                corePerRoll1: this.printingForm.value.corePerRoll1,
                coreSize1: this.printingForm.value.coreSize1,
                corePerRoll2: this.printingForm.value.corePerRoll2,
                coreSize2: this.printingForm.value.coreSize2,
                corePerRoll3: this.printingForm.value.corePerRoll3,
                coreSize3: this.printingForm.value.coreSize3,
                countForRoll: this.printingForm.value.countForRoll,
                totalRoll : this.printingForm.value.totalRoll,
                cuttingDateOfEntry: this.printingForm.value.cuttingDateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('cuttings', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.printingForm.reset();
                    }
                });
            } else {
                this.service.updateData('cuttings', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.printingForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.printingForm.patchValue({
            printingSizeAsPerPrintingRoll: data.printingSizeAsPerPrintingRoll,
            inkUsed: data.inkUsed,
            corePerRoll1: data.corePerRoll1,
            coreSize1: data.coreSize1,
            corePerRoll2: data.corePerRoll2,
            coreSize2: data.coreSize2,
            corePerRoll3: data.corePerRoll3,
            coreSize3: data.coreSize3,
            countForRoll: data.countForRoll,
            totalRoll: data.totalRoll,
            cuttingDateOfEntry: new Date(data.cuttingDateOfEntry)
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
                this.service.deleteData('cuttings', id).subscribe((res) => {
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


    downloadExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cutting Printed Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Cutting_Printed_Data.xlsx');
    }

}

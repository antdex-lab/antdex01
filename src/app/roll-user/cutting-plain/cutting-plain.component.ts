import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";

export interface Dropdown {
    category: string;
    options: Array<{
        value: string;
        label: string;
    }>;
}

export interface RollDropDown {
    value: string;
    label: string;
}

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './cutting-plain.component.html',
    styleUrl: './cutting-plain.component.scss'
})
export class CuttingPlainComponent implements OnInit {

    displayedColumns: string[] = ['cuttingSizeFromJumboRoll', 'inkUsed', 'countForRoll', 'totalRoll', 'cuttingDateOfEntry', 'action'];
    dataSource: any[] = [];

    cuttingPlainForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    dropdown: Dropdown;
    coreSizeDropdown: any[] = [];
    rollDropdown: RollDropDown;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.cuttingPlainForm = this.fb.group({
            cuttingSizeFromJumboRoll: ['', Validators.required],
            countForRoll: ['', Validators.required],
            inkUsed: [''],
            corePerRoll1: ['', Validators.required],
            coreSize1: ['', Validators.required],
            corePerRoll2: ['', Validators.required],
            coreSize2: ['', Validators.required],
            corePerRoll3: ['', Validators.required],
            coreSize3: ['', Validators.required],
            totalRoll: ['', Validators.required],
            cuttingDateOfEntry: [new Date()]
        });
    }

    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/ECG Roll Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                LoadingSpinnerComponent.hide();
            }
        })

        this.service.getData('dropdown/core-size').subscribe((res) => {
            if (res.statusCode === 200) {
                const sizeArr = Array.from(new Set(res.data.map((item: any) => item.label.toString())));
                console.log(sizeArr);
                this.coreSizeDropdown = sizeArr;
                // this.dropdown = res.data;
                LoadingSpinnerComponent.hide();
            }
        })
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('plainRollCuts').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        console.log(this.cuttingPlainForm.value);
        console.log(this.cuttingPlainForm.valid);
        if (this.cuttingPlainForm.valid) {
            const sendData = {
                cuttingSizeFromJumboRoll: this.cuttingPlainForm.value.cuttingSizeFromJumboRoll,
                inkUsed: this.cuttingPlainForm.value.inkUsed,
                corePerRoll1: this.cuttingPlainForm.value.corePerRoll1,
                coreSize1: this.cuttingPlainForm.value.coreSize1,
                corePerRoll2: this.cuttingPlainForm.value.corePerRoll2,
                coreSize2: this.cuttingPlainForm.value.coreSize2,
                corePerRoll3: this.cuttingPlainForm.value.corePerRoll3,
                coreSize3: this.cuttingPlainForm.value.coreSize3,
                countForRoll: this.cuttingPlainForm.value.countForRoll,
                totalRoll: this.cuttingPlainForm.value.totalRoll,
                cuttingDateOfEntry: this.cuttingPlainForm.value.cuttingDateOfEntry
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('plainRollCuts', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.cuttingPlainForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('plainRollCuts', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.cuttingPlainForm.reset();
                    }
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please fill all the required fields!',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
            })
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.cuttingPlainForm.setValue({
            cuttingSizeFromJumboRoll: data.cuttingSizeFromJumboRoll,
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('plainRollCuts', id).subscribe((res) => {
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

    calculateTotal(): void {
        const corePerRoll1 = Number(this.cuttingPlainForm.get('corePerRoll1')?.value) || 0;
        const corePerRoll2 = Number(this.cuttingPlainForm.get('corePerRoll2')?.value) || 0;
        const corePerRoll3 = Number(this.cuttingPlainForm.get('corePerRoll3')?.value) || 0;

        const total = corePerRoll1 + corePerRoll2 + corePerRoll3;
        this.cuttingPlainForm.get('totalRoll')?.setValue(total);
    }

    downloadExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cutting Plain Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Cutting_Plain_Data.xlsx');
    }

}

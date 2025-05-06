import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, of, startWith } from 'rxjs';

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
    printingDropdown: Dropdown;
    rollDropdown: RollDropDown;

    ecgRollControl = new FormControl('', Validators.required);
    printingSizeData: any = null;
    printingSizeFilteredOptions: Observable<any[]>;

    coreSizeDropdown: any[] = [];

    coreSizeCtrl1 = new FormControl('');
    coreSizeCtrl2 = new FormControl('');
    coreSizeCtrl3 = new FormControl('');

    coreSizeFilteredOptions: Observable<any[]>;
    coreSizeFilteredOptions2: Observable<any[]>;
    coreSizeFilteredOptions3: Observable<any[]>;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.cuttingPlainForm = this.fb.group({
            cuttingSizeFromJumboRoll: this.ecgRollControl,
            countForRoll: [''],
            inkUsed: [''],
            corePerRoll1: [''],
            coreSize1: this.coreSizeCtrl1,
            corePerRoll2: [''],
            coreSize2: this.coreSizeCtrl2,
            corePerRoll3: [''],
            coreSize3: this.coreSizeCtrl3,
            totalRoll: [''],
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

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/core-size').subscribe((res) => {
            if (res.statusCode === 200) {
                const sizeArr = Array.from(new Set(res.data.map((item: any) => item.label.toString())));
                this.coreSizeDropdown = sizeArr;

                this.coreSizeFilteredOptions = this.coreSizeCtrl1.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );

                this.coreSizeFilteredOptions2 = this.coreSizeCtrl2.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );

                this.coreSizeFilteredOptions3 = this.coreSizeCtrl3.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );

                LoadingSpinnerComponent.hide();
            }
        })

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Printing Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.printingDropdown = res.data;
                LoadingSpinnerComponent.hide();

                this.printingSizeFilteredOptions = this.ecgRollControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterSize(value || '')),
                );
            }
        })
    }

    private _filterSize(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.managePrintingSize();
        }
        return this.printingDropdown.options.filter((option: any) => option.label.toLowerCase().includes(filterValue));
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.coreSizeDropdown.filter((option: any) => option.toLowerCase().includes(filterValue));
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return { ...data, value: formattedValue };
    }

    managePrintingSize() {
        if (this.ecgRollControl.value && this.ecgRollControl.value !== "") {
            if (this.printingSizeData !== null) {
                this.printingDropdown.options.pop();
                this.printingSizeFilteredOptions = of(this.printingDropdown.options)
            }

            const optionData = {
                label: this.ecgRollControl.value,
                value: this.ecgRollControl.value.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.printingDropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.printingSizeData = newOption;
                this.printingDropdown.options.push(newOption);
            }
        } else {
            if (this.printingSizeData !== null) {
                this.printingDropdown.options.pop();
                this.printingSizeFilteredOptions = of(this.printingDropdown.options)
            }
            this.printingSizeData = null;
        }
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('plainRollCuts').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
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
                        this.loadDropdown();
                        this.cuttingPlainForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('plainRollCuts', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.loadDropdown();
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

        console.log(data);

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

        // const total = corePerRoll1 + corePerRoll2 + corePerRoll3;
        // this.cuttingPlainForm.get('totalRoll')?.setValue(total);
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

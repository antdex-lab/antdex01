import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown } from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, of, startWith } from 'rxjs';

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
        this.printingForm = this.fb.group({
            printingSizeAsPerPrintingRoll: this.ecgRollControl,
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
        this.service.getData('dropdown/category/Printing Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                LoadingSpinnerComponent.hide();

                this.printingSizeFilteredOptions = this.ecgRollControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );
            }
        })

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/core-size').subscribe((res) => {
            if (res.statusCode === 200) {
                const sizeArr = Array.from(new Set(res.data.map((item: any) => item.label.toString())));
                this.coreSizeDropdown = sizeArr;

                this.coreSizeFilteredOptions = this.coreSizeCtrl1.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterSize(value || '')),
                );

                this.coreSizeFilteredOptions2 = this.coreSizeCtrl2.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterSize(value || '')),
                );

                this.coreSizeFilteredOptions3 = this.coreSizeCtrl3.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterSize(value || '')),
                );

                LoadingSpinnerComponent.hide();
            }
        })
    }

    private _filterSize(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.coreSizeDropdown.filter((option: any) => option.toLowerCase().includes(filterValue));
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.managePrintingSize();
        }
        return this.dropdown.options.filter((option: any) => option.label.toLowerCase().includes(filterValue));
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return { ...data, value: formattedValue };
    }

    managePrintingSize() {
        if (this.ecgRollControl.value && this.ecgRollControl.value !== "") {
            if (this.printingSizeData !== null) {
                this.dropdown.options.pop();
                this.printingSizeFilteredOptions = of(this.dropdown.options)
            }

            const optionData = {
                label: this.ecgRollControl.value,
                value: this.ecgRollControl.value.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.dropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.printingSizeData = newOption;
                this.dropdown.options.push(newOption);
            }
        } else {
            if (this.printingSizeData !== null) {
                this.dropdown.options.pop();
                this.printingSizeFilteredOptions = of(this.dropdown.options)
            }
            this.printingSizeData = null;
        }
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('cuttings').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    calculateTotal(): void {
        const corePerRoll1 = Number(this.printingForm.get('corePerRoll1')?.value) || 0;
        const corePerRoll2 = Number(this.printingForm.get('corePerRoll2')?.value) || 0;
        const corePerRoll3 = Number(this.printingForm.get('corePerRoll3')?.value) || 0;

        // const total = corePerRoll1 + corePerRoll2 + corePerRoll3;
        // this.printingForm.get('totalRoll')?.setValue(total);
    }

    submit() {
        if (this.printingForm.valid) {

            if (this.printingSizeData !== null) {
                this.service.updateDropdown('dropdown/category', this.dropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        console.log("DROPDOWN UPDATED")
                    }
                })
            }

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
                totalRoll: this.printingForm.value.totalRoll,
                cuttingDateOfEntry: this.printingForm.value.cuttingDateOfEntry
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('cuttings', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.printingForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('cuttings', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('cuttings', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cutting Printed Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Cutting_Printed_Data.xlsx');
    }

}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown } from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, of, startWith } from 'rxjs';

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './packing.component.html',
    styleUrl: './packing.component.scss'
})
export class PackingComponent implements OnInit {

    displayedColumns: string[] = ['labelPerRoll', 'labelSize', 'withBox', 'totalRollPacked', 'dateOfEntry', 'action'];
    dataSource: any[] = [];
    packingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    dropdown: Dropdown;

    labelSizeData: any = null;
    labelSizeControl = new FormControl("", Validators.required);
    filteredOptions: Observable<any[]>;

    boxSizeData: any = null;
    boxSizeControl = new FormControl("");
    boxSizeDropdown: Dropdown;
    boxFilteredOptions: Observable<any[]>;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.loadBoxDropdown();
        this.initializeForm();
        this.setupFormListeners();
    }

    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Label Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                LoadingSpinnerComponent.hide();

                this.filteredOptions = this.labelSizeControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                );
            }
        })
    }

    loadBoxDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Box Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.boxSizeDropdown = res.data;
                LoadingSpinnerComponent.hide();

                this.boxFilteredOptions = this.boxSizeControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterBox(value || ''))
                );

                this.boxSizeControl.disable();
            }
        })
    }

    private _filterBox(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.manageLabelSize();
        }
        return this.boxSizeDropdown.options.filter(option => option.label.toLowerCase().includes(filterValue));
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.manageLabelSize();
        }
        return this.dropdown.options.filter(option => option.label.toLowerCase().includes(filterValue));
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return { ...data, value: formattedValue };
    }

    manageLabelSize() {
        if (this.labelSizeControl.value && this.labelSizeControl.value !== "") {
            if (this.labelSizeData !== null) {
                this.dropdown.options.pop();
                this.filteredOptions = of(this.dropdown.options)
            }

            const optionData = {
                label: this.labelSizeControl.value,
                value: this.labelSizeControl.value.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.dropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.labelSizeData = newOption;
                this.dropdown.options.push(newOption);
            }
        } else {
            if (this.labelSizeData !== null) {
                this.dropdown.options.pop();
                this.filteredOptions = of(this.dropdown.options)
            }
            this.labelSizeData = null;
        }
    }

    manageBoxSize() {
        if (this.boxSizeControl.value && this.boxSizeControl.value !== "") {
            if (this.boxSizeData !== null) {
                this.boxSizeDropdown.options.pop();
                this.boxFilteredOptions = of(this.boxSizeDropdown.options)
            }

            const optionData = {
                label: this.boxSizeControl.value,
                value: this.boxSizeControl.value.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.boxSizeDropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.boxSizeData = newOption;
                this.boxSizeDropdown.options.push(newOption);
            }
        } else {
            if (this.boxSizeData !== null) {
                this.boxSizeDropdown.options.pop();
                this.boxFilteredOptions = of(this.boxSizeDropdown.options)
            }
            this.boxSizeData = null;
        }
    }

    initializeForm() {
        this.packingForm = this.fb.group({
            labelPerRoll: ['', Validators.required],
            labelSize: this.labelSizeControl,
            boxPacked: [''],
            boxPackedPerCartoon: [''],
            totalRollPacked: ['', Validators.required],
            withBox: [false],
            withoutBox: [false],
            BoxSize: this.boxSizeControl,
            dateOfEntry: [new Date()]
        });
    }

    setupFormListeners() {
        // Allow only one checkbox to be selected at a time
        this.packingForm.get('withBox')?.valueChanges.subscribe((withBoxSelected) => {
            if (withBoxSelected) {
                this.packingForm.get('withoutBox')?.setValue(false);
                // this.packingForm.get('BoxSize')?.enable();
                this.boxSizeControl.enable();
            } else {
                this.boxSizeControl.disable();
                this.boxSizeControl.setValue('');
                // this.packingForm.get('BoxSize')?.disable();
                // this.packingForm.get('BoxSize')?.setValue('');
            }
        });

        this.packingForm.get('withoutBox')?.valueChanges.subscribe((withoutBoxSelected) => {
            if (withoutBoxSelected) {
                this.packingForm.get('withBox')?.setValue(false);
                // this.packingForm.get('BoxSize')?.disable();
                // this.packingForm.get('BoxSize')?.setValue('');
                this.boxSizeControl.disable();
                this.boxSizeControl.setValue('');
            }
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('packings').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        if (this.packingForm.valid) {
            const sendData = {
                labelPerRoll: this.packingForm.value.labelPerRoll,
                labelSize: this.packingForm.value.labelSize,
                boxPacked: this.packingForm.value.boxPacked,
                boxPackedPerCartoon: this.packingForm.value.boxPackedPerCartoon,
                totalRollPacked: this.packingForm.value.totalRollPacked,
                withBox: this.packingForm.value.withBox ? true : false,
                withoutBox: this.packingForm.value.withoutBox ? true : false,
                BoxSize: this.packingForm.value.BoxSize,
                dateOfEntry: this.packingForm.value.dateOfEntry
            };

            if (this.labelSizeData !== null) {
                this.service.updateDropdown('dropdown/category', this.dropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        console.log("DROPDOWN UPDATED")
                    }
                })
            }

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('packings', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.packingForm.reset();
                        this.initializeForm(); // Reinitialize the form to reset disabled state
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('packings', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.packingForm.reset();
                        this.initializeForm(); // Reinitialize the form to reset disabled state
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        console.log(data);

        this.packingForm.patchValue({
            labelPerRoll: data.labelPerRoll,
            labelSize: data.labelSize,
            withBox: data.withBox,
            withoutBox: data.withoutBox,
            boxPacked: data.boxPacked,
            boxPackedPerCartoon: data.boxPackedPerCartoon,
            totalRollPacked: data.totalRollPacked,
            BoxSize: data.BoxSize || '',
            dateOfEntry: new Date(data.dateOfEntry)
        });

        // Manually enable or disable BoxSize based on withBox value
        if (data.withBox) {
            this.packingForm.get('BoxSize')?.enable();
        } else {
            this.packingForm.get('BoxSize')?.disable();
        }
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
                this.service.deleteData('packings', id).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        Swal.fire(
                            'Deleted!',
                            'The packing entry has been deleted.',
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Packing Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Packing_Data.xlsx');
    }
}

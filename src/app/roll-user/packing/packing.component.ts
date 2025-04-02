import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown } from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './packing.component.html',
    styleUrl: './packing.component.scss'
})
export class PackingComponent implements OnInit {

    displayedColumns: string[] = ['labelPerRoll', 'labelSize','withBox', 'totalRollPacked', 'dateOfEntry', 'action'];
    dataSource: any[] = [];
    packingForm: FormGroup;
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
        this.initializeForm();
        this.setupFormListeners();
    }

    loadDropdown() {
        this.service.getData('dropdown/category/Label Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                console.log(this.dropdown);
            }
        })
    }

    initializeForm() {
        this.packingForm = this.fb.group({
            labelPerRoll: [''],
            labelSize: [''],
            boxPacked: [''],
            boxPackedPerCartoon: [''],
            totalRollPacked: [''],
            withBox: [false],
            withoutBox: [false],
            BoxSize: [{ value: '', disabled: true }],
            dateOfEntry: [new Date()]
        });
    }

    setupFormListeners() {
        // Allow only one checkbox to be selected at a time
        this.packingForm.get('withBox')?.valueChanges.subscribe((withBoxSelected) => {
            if (withBoxSelected) {
                this.packingForm.get('withoutBox')?.setValue(false);
                this.packingForm.get('BoxSize')?.enable();
            } else {
                this.packingForm.get('BoxSize')?.disable();
                this.packingForm.get('BoxSize')?.setValue('');
            }
        });

        this.packingForm.get('withoutBox')?.valueChanges.subscribe((withoutBoxSelected) => {
            if (withoutBoxSelected) {
                this.packingForm.get('withBox')?.setValue(false);
                this.packingForm.get('BoxSize')?.disable();
                this.packingForm.get('BoxSize')?.setValue('');
            }
        });
    }

    loadData() {
        this.service.getData('packings').subscribe((res) => {
            this.dataSource = res;
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

            if (!this.isEdit) {
                this.service.createData('packings', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.packingForm.reset();
                        this.initializeForm(); // Reinitialize the form to reset disabled state
                    }
                });
            } else {
                this.service.updateData('packings', this.elementId, sendData).subscribe((res) => {
                    if (res) {
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
                this.service.deleteData('packings', id).subscribe((res) => {
                    if (res) {
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

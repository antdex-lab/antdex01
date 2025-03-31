import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface LabelSizeDropdown {
    category: string;
    options: Array<{
        value: string;
        label: string;
    }>;
}

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-label.component.html',
    styleUrl: './raw-label.component.scss'
})
export class RawLabelComponent implements OnInit {

    displayedColumns: string[] = ['price', 'labelSize', 'labelCount', 'pricePerLabel', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    labelForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    labelSizeDropdown: LabelSizeDropdown;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadDropdown();
        this.loadData();
        this.labelForm = this.fb.group({
            rawMaterial: [''],
            price: [''],
            labelSize: [''],
            labelCount: [''],
            pricePerLabel: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadDropdown() {
        this.service.getData('dropdown/category/Label Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.labelSizeDropdown = res.data;
                console.log(this.labelSizeDropdown);
            }
        })
    }

    loadData() {
        this.service.getData('labels').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.labelForm.valid) {
            const sendData = {
                rawMaterial: this.labelForm.value.rawMaterial,
                price: this.labelForm.value.price,
                labelSize: this.labelForm.value.labelSize,
                labelCount: this.labelForm.value.labelCount,
                pricePerLabel: this.labelForm.value.pricePerLabel,
                dateOfEntry: this.labelForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('labels', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.labelForm.reset();
                    }
                });
            } else {
                this.service.updateData('labels', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.labelForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        console.log(data);

        this.labelForm.patchValue({
            rawMaterial: data.rawMaterial,
            price: data.price,
            labelSize: data.labelSize,
            labelCount: data.labelCount,
            pricePerLabel: data.pricePerLabel,
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
                this.service.deleteData('labels', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Label Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Label_Data.xlsx');
    }
}

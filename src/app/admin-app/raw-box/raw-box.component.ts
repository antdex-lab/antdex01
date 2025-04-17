import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { Dropdown } from '../../roll-user/cutting-plain/cutting-plain.component';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-box.component.html',
    styleUrl: './raw-box.component.scss'
})
export class RawBoxComponent implements OnInit {

    displayedColumns: string[] = ['boxSize', 'boxCount', 'pricePerBox', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    boxForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    boxSizeData: any = null;
    boxSizeControl = new FormControl("", Validators.required);
    boxSizeDropdown: Dropdown;
    filteredOptions: Observable<any[]>;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.boxForm = this.fb.group({
            boxSize: this.boxSizeControl,
            boxCount: ['', Validators.required],
            pricePerBox: ['', Validators.required],
            totalPrice: ['', Validators.required],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('boxs').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Box Size').subscribe((res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                this.boxSizeDropdown = res.data;

                this.filteredOptions = this.boxSizeControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                );
            }
        })
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.manageBoxSize();
        }
        return this.boxSizeDropdown.options.filter(option => option.label.toLowerCase().includes(filterValue));
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return { ...data, value: formattedValue };
    }

    manageBoxSize() {
        if (this.boxSizeControl.value && this.boxSizeControl.value !== "") {
            if (this.boxSizeData !== null) {
                this.boxSizeDropdown.options.pop();
                this.filteredOptions = of(this.boxSizeDropdown.options)
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
                this.filteredOptions = of(this.boxSizeDropdown.options)
            }
            this.boxSizeData = null;
        }
    }

    submit() {
        if (this.boxForm.valid) {
            const sendData = {
                boxSize: this.boxForm.value.boxSize,
                boxCount: this.boxForm.value.boxCount,
                pricePerBox: this.boxForm.value.pricePerBox,
                totalPrice: this.boxForm.value.totalPrice,
                dateOfEntry: this.boxForm.value.dateOfEntry
            };

            if (this.boxSizeData !== null) {
                this.service.updateDropdown('dropdown/category', this.boxSizeDropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        this.loadDropdown();
                    }
                })
            }

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('boxs', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.boxForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('boxs', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.boxForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.boxForm.patchValue({
            boxSize: data.boxSize,
            boxCount: data.boxCount,
            pricePerBox: data.pricePerBox,
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
                this.service.deleteData('boxs', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Box Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Box_Data.xlsx');
    }

    totalPrice() {
        const { boxCount, pricePerBox } = this.boxForm.value;

        if (pricePerBox && boxCount) {
            const total = Number(boxCount) * Number(pricePerBox);
            this.boxForm.patchValue({ totalPrice: total.toFixed(2) });
        }
    }

}

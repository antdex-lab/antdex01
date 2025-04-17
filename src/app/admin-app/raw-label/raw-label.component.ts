import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, of, startWith } from 'rxjs';

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

    labelSizeData: any = null;
    labelSizeControl = new FormControl("");
    labelSizeDropdown: LabelSizeDropdown;
    filteredOptions: Observable<any[]>;

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
            labelSize: this.labelSizeControl,
            labelCount: [''],
            pricePerLabel: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Label Size').subscribe((res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                this.labelSizeDropdown = res.data;

                this.filteredOptions = this.labelSizeControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                );
            }
        })
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.manageLabelSize();
        }
        return this.labelSizeDropdown.options.filter(option => option.label.toLowerCase().includes(filterValue));
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('labels').subscribe((res) => {
            LoadingSpinnerComponent.hide();
            this.dataSource = res;
        });
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return { ...data, value: formattedValue };
    }

    manageLabelSize() {
        if (this.labelSizeControl.value && this.labelSizeControl.value !== "") {
            if (this.labelSizeData !== null) {
                this.labelSizeDropdown.options.pop();
                this.filteredOptions = of(this.labelSizeDropdown.options)
            }

            const optionData = {
                label: this.labelSizeControl.value,
                value: this.labelSizeControl.value.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.labelSizeDropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.labelSizeData = newOption;
                this.labelSizeDropdown.options.push(newOption);
            }
        } else {
            if (this.labelSizeData !== null) {
                this.labelSizeDropdown.options.pop();
                this.filteredOptions = of(this.labelSizeDropdown.options)
            }
            this.labelSizeData = null;
        }
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

            if (this.labelSizeData !== null) {
                this.service.updateDropdown('dropdown/category', this.labelSizeDropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        console.log("DROPDOWN UPDATED")
                    }
                })
            }

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('labels', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.labelForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('labels', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('labels', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Label Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Label_Data.xlsx');
    }
}

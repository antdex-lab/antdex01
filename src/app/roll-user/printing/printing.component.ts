import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown, RollDropDown } from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './printing.component.html',
    styleUrl: './printing.component.scss'
})
export class PrintingComponent implements OnInit {

    displayedColumns: string[] = ['printingSizePerJumboRoll', 'printingSize','inkColor', 'inkUsed', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    printingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    dropdown: Dropdown;
    dropdown2: Dropdown;

    rollDropdown: RollDropDown[];

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.printingForm = this.fb.group({
            printingSizePerJumboRoll: [''],
            printingSize: [''],
            inkColor: [''],
            inkUsed: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadDropdown() {

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/papers').subscribe((res) => {
            if (res.statusCode === 200) {
                this.rollDropdown = res.data;
                LoadingSpinnerComponent.hide();
            }
        })

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Printing Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                LoadingSpinnerComponent.hide();
            }
        })

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Ink Color').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown2 = res.data;
                LoadingSpinnerComponent.hide();
            }
        })
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('printings').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        if (this.printingForm.valid) {
            const sendData = {
                printingSizePerJumboRoll: !this.isEdit ?  this.rollDropdown.filter((i) => i.value === this.printingForm.value.printingSizePerJumboRoll)[0].label : this.printingForm.value.printingSizePerJumboRoll,
                id: this.printingForm.value.printingSizePerJumboRoll,
                printingSize: this.printingForm.value.printingSize,
                inkUsed: this.printingForm.value.inkUsed,
                inkColor : this.printingForm.value.inkColor,
                dateOfEntry: this.printingForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('printings', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.printingForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('printings', this.elementId, sendData).subscribe((res) => {
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
        // const roll = this.rollDropdown.filter((i) => i.label === data.printingSizePerJumboRoll);

        this.printingForm.patchValue({
            printingSizePerJumboRoll: data.printingSizePerJumboRoll,
            printingSize: data.printingSize,
            inkColor : data.inkColor,
            inkUsed: data.inkUsed,
            dateOfEntry: new Date(data.dateOfEntry)
        });

        this.printingForm.get('printingSizePerJumboRoll')?.disable();

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
                this.service.deleteData('printings', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Printing Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Printing_Data.xlsx');
    }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown, RollDropDown } from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './printing.component.html',
    styleUrl: './printing.component.scss'
})
export class PrintingComponent implements OnInit {

    displayedColumns: string[] = ['printingSizePerJumboRoll', 'printingSize', 'inkUsed', 'dateOfEntry', 'action'];
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

        this.service.getData('dropdown/papers').subscribe((res) => {
            if (res.statusCode === 200) {
                this.rollDropdown = res.data;
                console.log("papers", this.rollDropdown);
            }
        })

        this.service.getData('dropdown/category/Printing Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                console.log(this.dropdown);
            }
        })

        this.service.getData('dropdown/category/Ink Color').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown2 = res.data;
                console.log(this.dropdown2);
            }
        })
    }

    loadData() {
        this.service.getData('printings').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.printingForm.valid) {
            const sendData = {
                printingSizePerJumboRoll: this.rollDropdown.filter((i) => i.value === this.printingForm.value.printingSizePerJumboRoll)[0].label,
                id: this.printingForm.value.printingSizePerJumboRoll,
                printingSize: this.printingForm.value.printingSize,
                inkUsed: this.printingForm.value.inkUsed,
                dateOfEntry: this.printingForm.value.dateOfEntry
            };

            console.log(sendData);

            if (!this.isEdit) {
                this.service.createData('printings', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.printingForm.reset();
                    }
                });
            } else {
                this.service.updateData('printings', this.elementId, sendData).subscribe((res) => {
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

        this.printingForm.setValue({
            printingSizePerJumboRoll: data.printingSizePerJumboRoll,
            printingSize: data.printingSize,
            inkUsed: data.inkUsed,
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
                this.service.deleteData('printings', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Printing Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Printing_Data.xlsx');
    }

}

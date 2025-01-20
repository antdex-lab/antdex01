import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";

export interface Dropdown {
    category: string;
    options: Array<{
        value: string;
        label: string;
    }>;
}

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './cutting-plain.component.html',
    styleUrl: './cutting-plain.component.scss'
})
export class CuttingPlainComponent implements OnInit {

    displayedColumns: string[] = ['cuttingSizeFromJumboRoll', 'countForRoll', 'inkUsed', 'corePerRoll', 'coreSize', 'cuttingDateOfEntry', 'action'];
    dataSource: any[] = [];

    cuttingPlainForm: FormGroup;
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
        this.cuttingPlainForm = this.fb.group({
            cuttingSizeFromJumboRoll: [''],
            countForRoll: [''],
            inkUsed: [''],
            corePerRoll: [''],
            coreSize: [''],
            cuttingDateOfEntry: [new Date()]
        });
    }

    loadDropdown() {
        this.service.getData('dropdown/category/ECG Roll Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                console.log(this.dropdown);
            }
        })
    }

    loadData() {
        this.service.getData('plainRollCuts').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.cuttingPlainForm.valid) {
            const sendData = {
                cuttingSizeFromJumboRoll: this.cuttingPlainForm.value.cuttingSizeFromJumboRoll,
                countForRoll: this.cuttingPlainForm.value.countForRoll,
                inkUsed: this.cuttingPlainForm.value.inkUsed,
                corePerRoll: this.cuttingPlainForm.value.corePerRoll,
                coreSize: this.cuttingPlainForm.value.coreSize,
                cuttingDateOfEntry: this.cuttingPlainForm.value.cuttingDateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('plainRollCuts', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.cuttingPlainForm.reset();
                    }
                });
            } else {
                this.service.updateData('plainRollCuts', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.cuttingPlainForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.cuttingPlainForm.setValue({
            cuttingSizeFromJumboRoll: data.cuttingSizeFromJumboRoll,
            countForRoll: data.countForRoll,
            inkUsed: data.inkUsed,
            corePerRoll: data.corePerRoll,
            coreSize: data.coreSize,
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
                this.service.deleteData('plainRollCuts', id).subscribe((res) => {
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

}

import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './cutting-printed.component.html',
    styleUrl: './cutting-printed.component.scss'
})
export class CuttingPrintedComponent implements OnInit{

    displayedColumns: string[] = ['printingSizeAsPerPrintingRoll', 'countForRoll', 'inkUsed', 'corePerRoll','coreSize', 'cuttingDateOfEntry', 'action'];
    dataSource: any[] = [];

    printingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.printingForm = this.fb.group({
            printingSizeAsPerPrintingRoll: [''],
            countForRoll: [''],
            inkUsed: [''],
            corePerRoll: [''],
            coreSize: [''],
            cuttingDateOfEntry: [new Date()]
        });
    }

    loadData() {
        this.service.getData('cuttings').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.printingForm.valid) {
            const sendData = {
                printingSizeAsPerPrintingRoll: this.printingForm.value.printingSizeAsPerPrintingRoll,
                countForRoll: this.printingForm.value.countForRoll,
                inkUsed: this.printingForm.value.inkUsed,
                corePerRoll: this.printingForm.value.corePerRoll,
                coreSize: this.printingForm.value.coreSize,
                cuttingDateOfEntry: this.printingForm.value.cuttingDateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('cuttings', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.printingForm.reset();
                    }
                });
            } else {
                this.service.updateData('cuttings', this.elementId, sendData).subscribe((res) => {
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
            printingSizeAsPerPrintingRoll: data.printingSizeAsPerPrintingRoll,
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
                this.service.deleteData('cuttings', id).subscribe((res) => {
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

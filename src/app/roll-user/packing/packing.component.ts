import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './packing.component.html',
    styleUrl: './packing.component.scss'
})
export class PackingComponent implements OnInit{

    displayedColumns: string[] = ['labelPerRoll', 'withBox', 'withoutBox', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    packingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.packingForm = this.fb.group({
            labelPerRoll: [''],
            withBox: [''],
            withoutBox: [''],
            dateOfEntry: [new Date()]
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
                withBox: this.packingForm.value.withBox ? true : false,
                withoutBox: this.packingForm.value.withoutBox ? true : false,
                dateOfEntry: this.packingForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('packings', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.packingForm.reset();
                    }
                });
            } else {
                this.service.updateData('packings', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.packingForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.packingForm.setValue({
            labelPerRoll: data.labelPerRoll,
            withBox: data.withBox,
            withoutBox: data.withoutBox,
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
                this.service.deleteData('packings', id).subscribe((res) => {
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

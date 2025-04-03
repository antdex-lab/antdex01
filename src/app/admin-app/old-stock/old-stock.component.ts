import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-old-stock',
    templateUrl: './old-stock.component.html',
    styleUrl: './old-stock.component.scss'
})
export class OldStockComponent implements OnInit {

    displayedColumns: string[] = ['noOfRolls', 'rollsWithSizeLabel', 'noOfPacket', 'packetModelSize', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    oldStockForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.loadData();
        this.oldStockForm = this.fb.group({
            noOfRolls: [''],
            rollsWithSizeLabel: [''],
            noOfPacket: [''],
            packetModelSize: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('old-stock').subscribe((res) => {
            if (res) {
                LoadingSpinnerComponent.hide();
                this.dataSource = res;
            }
        });
    }

    submit() {
        if (this.oldStockForm.valid) {
            const sendData = {
                noOfRolls: this.oldStockForm.value.noOfRolls,
                rollsWithSizeLabel: this.oldStockForm.value.rollsWithSizeLabel,
                noOfPacket: this.oldStockForm.value.noOfPacket,
                packetModelSize: this.oldStockForm.value.packetModelSize,
                dateOfEntry: this.oldStockForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('old-stock', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.oldStockForm.reset();
                        LoadingSpinnerComponent.hide();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('old-stock', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.oldStockForm.reset();
                        LoadingSpinnerComponent.hide();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.oldStockForm.patchValue({
            noOfRolls: data.noOfRolls,
            rollsWithSizeLabel: data.rollsWithSizeLabel,
            noOfPacket: data.noOfPacket,
            packetModelSize: data.packetModelSize,
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
                this.service.deleteData('old-stock', id).subscribe((res) => {
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

        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(data, 'Old_stock.xlsx');
    }
}

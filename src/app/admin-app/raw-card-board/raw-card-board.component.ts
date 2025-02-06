import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-card-board.component.html',
    styleUrl: './raw-card-board.component.scss'
})
export class RawCardBoardComponent implements OnInit{

    displayedColumns: string[] = ['cardboardSize', 'cardboardCount', 'pricePerCardboard', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    cardBoardForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.cardBoardForm = this.fb.group({
            cardboardSize: [''],
            cardboardCount: [''],
            pricePerCardboard: [''],
            totalPrice: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        this.service.getData('cardboards').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.cardBoardForm.valid) {
            const sendData = {
                cardboardSize: this.cardBoardForm.value.cardboardSize,
                cardboardCount: this.cardBoardForm.value.cardboardCount,
                pricePerCardboard: this.cardBoardForm.value.pricePerCardboard,
                totalPrice: this.cardBoardForm.value.totalPrice,
                dateOfEntry: this.cardBoardForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('cardboards', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.cardBoardForm.reset();
                    }
                });
            } else {
                this.service.updateData('cardboards', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.isEdit = false;
                        this.cardBoardForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.cardBoardForm.setValue({
            cardboardSize: data.cardboardSize,
            cardboardCount: data.cardboardCount,
            pricePerCardboard: data.pricePerCardboard,
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
                this.service.deleteData('cardboards', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Cardboard Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Cardboard_Data.xlsx');
    }
}

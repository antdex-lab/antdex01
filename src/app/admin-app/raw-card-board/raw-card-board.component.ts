import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-card-board.component.html',
    styleUrl: './raw-card-board.component.scss'
})
export class RawCardBoardComponent implements OnInit {

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
            cardboardSize: ['', Validators.required],
            printed: ['', Validators.required],
            cardboardCount: ['', Validators.required],
            pricePerCardboard: ['', Validators.required],
            totalPrice: ['', Validators.required],
            dateOfEntry: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('cardboards').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        if (this.cardBoardForm.valid) {
            const sendData = {
                cardboardSize: this.cardBoardForm.value.cardboardSize,
                cardboardCount: this.cardBoardForm.value.cardboardCount,
                printed: this.cardBoardForm.value.printed,
                pricePerCardboard: this.cardBoardForm.value.pricePerCardboard,
                totalPrice: this.cardBoardForm.value.totalPrice,
                dateOfEntry: this.cardBoardForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('cardboards', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.cardBoardForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('cardboards', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
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

        this.cardBoardForm.patchValue({
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('cardboards', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Cardboard Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Cardboard_Data.xlsx');
    }

    totalPrice() {
        const { cardboardCount, pricePerCardboard } = this.cardBoardForm.value;

        if (cardboardCount && pricePerCardboard) {
            const total = Number(cardboardCount) * Number(pricePerCardboard);
            this.cardBoardForm.patchValue({ totalPrice: total.toFixed(2) });
        }
    }
}

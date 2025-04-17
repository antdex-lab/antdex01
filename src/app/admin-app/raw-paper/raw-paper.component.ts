import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, of, startWith } from 'rxjs';

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-paper.component.html',
    styleUrl: './raw-paper.component.scss'
})
export class RawPaperComponent implements OnInit {

    sizeMMOptions: string[] = [];
    gsmOptions: string[] = [];

    filteredOptions: Observable<string[]>;
    gsmFilteredOptions: Observable<string[]>;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    displayedColumns: string[] = ['sizeInMM', 'gsm', 'sizeInMeter', 'pricePerSquareMeters', 'totalSQM', 'paperKG', 'pricePerKG', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    papers: any[] = [];
    rawPaperForm: FormGroup;
    sizeControl = new FormControl("", Validators.required);
    gsmControl = new FormControl("", Validators.required);

    ngOnInit() {
        this.rawPaperForm = this.fb.group({
            paperSizeMM: this.sizeControl,
            paperSizeM: ['', Validators.required],
            gsmOfPaper: this.gsmControl,
            count: ['', Validators.required],
            pricePerSQM: ['', Validators.required],
            paperKG: [''],
            pricePerKG: [''],
            totalPrice: ['', Validators.required],
            entryDate: [new Date()]
        });

        this.loadPapers();
    }

    loadPapers() {
        LoadingSpinnerComponent.show();
        this.service.getData('papers').subscribe((res) => {
            if (res) {
                this.dataSource = res;
                this.loadAutoCompleteDropdown(res);
            }
            LoadingSpinnerComponent.hide();
        })
    }

    loadAutoCompleteDropdown(data: any) {
        const sizeArr: string[] = Array.from(new Set(data.map((item: any) => item.sizeInMM.toString())));
        const gsmArr: string[] = Array.from(new Set(data.map((item: any) => item.gsm)));

        this.sizeMMOptions = sizeArr;
        this.gsmOptions = gsmArr;

        this.filteredOptions = this.sizeControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || ''))
        );

        this.gsmFilteredOptions = this.gsmControl.valueChanges.pipe(
            startWith(''),
            map(value => this._gsmFilter(value || ''))
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.sizeMMOptions.filter(option => option.toLowerCase().includes(filterValue));
    }

    private _gsmFilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.gsmOptions.filter(option => option.toLowerCase().includes(filterValue));
    }

    submitRawPaperEntry() {
        if (this.rawPaperForm.valid) {
            const sendData = {
                sizeInMM: this.rawPaperForm.value.paperSizeMM,
                sizeInMeter: this.rawPaperForm.value.paperSizeM,
                pricePerSquareMeters: Number(this.rawPaperForm.value.pricePerSQM),
                gsm: this.rawPaperForm.value.gsmOfPaper,
                count: this.rawPaperForm.value.count,
                dateOfEntry: this.rawPaperForm.value.entryDate,
                pricePerKG: this.rawPaperForm.value.pricePerKG,
                paperKG: this.rawPaperForm.value.paperKG,
                totalPrice: this.rawPaperForm.value.totalPrice
            }

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('papers', sendData).subscribe((res) => {
                    if (res) {
                        this.loadPapers();
                        this.rawPaperForm.reset();
                        LoadingSpinnerComponent.hide();
                    }
                })
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('papers', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadPapers();
                        this.isEdit = false;
                        this.rawPaperForm.reset();
                        LoadingSpinnerComponent.hide();
                    }
                })
            }

        }
    }

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    isEdit: boolean = false;
    elementId: string = ''

    editData(data: any) {
        this.isEdit = true;

        this.elementId = data._id;

        this.rawPaperForm.patchValue({
            paperSizeMM: data.sizeInMM,
            paperSizeM: data.sizeInMeter,
            gsmOfPaper: data.gsm,
            count: data.count,
            pricePerSQM: data.pricePerSquareMeters,
            totalPrice: data.totalPrice,
            pricePerKG: data.pricePerKG ? data.pricePerKG : '',
            paperKG: data.paperKG ? data.paperKG : '',
            entryDate: new Date(data.dateOfEntry)
        });
    }

    deletePaper(id: string) {
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
                this.service.deleteData('papers', id).subscribe((res) => {
                    if (res) {
                        Swal.fire(
                            'Deleted!',
                            'The paper entry has been deleted.',
                            'success'
                        );
                        this.loadPapers();
                    }
                });
            }
        });
    }

    downloadExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Paper Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Paper_Data.xlsx');
    }

    totalPrice() {
        const { paperSizeMM, paperSizeM, pricePerSQM, paperKG, pricePerKG } = this.rawPaperForm.value;

        // if (paperSizeMM) {
        //     this.rawPaperForm.patchValue({ paperSizeM: (Number(paperSizeMM) / 1000).toFixed(2) });
        // }

        if (paperSizeMM && paperSizeM && pricePerSQM) {
            const total = (Number(paperSizeMM) / 1000) * Number(paperSizeM) * Number(pricePerSQM);
            // const total = (Number(paperSizeMM) / 1000) * Number(paperSizeM) * Number(count) * Number(pricePerSQM);
            this.rawPaperForm.patchValue({ totalPrice: total.toFixed(2) });
        }

        if (paperKG && pricePerKG) {
            const total = Number(paperKG) * Number(pricePerKG);
            // const total = (Number(paperSizeMM) / 1000) * Number(paperSizeM) * Number(count) * Number(pricePerSQM);
            this.rawPaperForm.patchValue({ totalPrice: total.toFixed(2) });
        }
    }

}

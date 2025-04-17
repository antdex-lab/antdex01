import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './z-fold-packing.component.html',
    styleUrl: './z-fold-packing.component.scss'
})
export class ZFoldPackingComponent implements OnInit {

    displayedColumns: string[] = ['cardBoardSize', 'modalSize', 'printed', 'noOfPacket', 'entryDate', 'action'];
    dataSource: any[] = [];

    zFoldPackingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    dropdown: any[] = [];;
    filteredOptions: Observable<any[]>;
    modalSizeCtrl = new FormControl("", Validators.required);

    cardboardDropdown: any[] = [];;
    cardboardFilteredOptions: Observable<any[]>;
    cardboardCtrl = new FormControl("", Validators.required);

    constructor(private service: ApiService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.loadCardboardSize();
        this.zFoldPackingForm = this.fb.group({
            cardBoardSize: this.cardboardCtrl,
            modalSize: this.modalSizeCtrl,
            printed: ['', Validators.required],
            noOfPacket: ['', Validators.required],
            entryDate: [new Date()]
        });
    }

    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/modal-size-with-count').subscribe((res) => {
            if (res.statusCode === 200) {
                const sizeArr = Array.from(new Set(res.data.map((item: any) => item.label.toString())));
                this.dropdown = sizeArr;
                LoadingSpinnerComponent.hide();

                this.filteredOptions = this.modalSizeCtrl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                );
            }
        })
    }

    loadCardboardSize() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/cardboard-size-with-count').subscribe((res) => {
            if (res.statusCode === 200) {
                const sizeArr = Array.from(new Set(res.data.map((item: any) => item.label.toString())));
                this.cardboardDropdown = sizeArr;
                LoadingSpinnerComponent.hide();

                this.cardboardFilteredOptions = this.cardboardCtrl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterCardboard(value || ''))
                );
            }
        })
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.dropdown.filter(option => option.toLowerCase().includes(filterValue));
    }

    private _filterCardboard(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.cardboardDropdown.filter(option => option.toLowerCase().includes(filterValue));
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('z-fold-packing').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    submit() {
        if (this.zFoldPackingForm.valid) {
            const sendData = {
                cardBoardSize: this.zFoldPackingForm.value.cardBoardSize,
                modalSize: this.zFoldPackingForm.value.modalSize,
                printed: this.zFoldPackingForm.value.printed,
                noOfPacket: this.zFoldPackingForm.value.noOfPacket,
                entryDate: this.zFoldPackingForm.value.entryDate
            };

            if (!this.isEdit) {

                LoadingSpinnerComponent.show();
                this.service.createData('z-fold-packing', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.zFoldPackingForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('z-fold-packing', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.zFoldPackingForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.zFoldPackingForm.patchValue({
            cardBoardSize: data.cardBoardSize,
            modalSize: data.modalSize,
            printed: String(data.printed),
            noOfPacket: data.noOfPacket,
            entryDate: new Date(data.entryDate)
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
                this.service.deleteData('z-fold-packing', id).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        Swal.fire(
                            'Deleted!',
                            'Deleted Successfully.',
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
    }

    // isToggled
    isToggled = false;
}

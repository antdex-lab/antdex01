import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './disptach.component.html',
    styleUrl: './disptach.component.scss'
})
export class DisptachComponent implements OnInit {

    displayedColumns: string[] = ['packetModelPerSize', 'noOfpacket', 'orderBy', 'DateAndTime', 'action'];
    dataSource: any[] = [];

    zFoldForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    dropdown: any[] = [];;
    filteredOptions: Observable<any[]>;
    modalSizeCtrl = new FormControl("", Validators.required);

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.zFoldForm = this.fb.group({
            packetModelPerSize: this.modalSizeCtrl,
            noOfpacket: ['', Validators.required],
            orderBy: ['', Validators.required],
            bill: [''],
            billNumber: [''],
            dispatchVia: [''],
            DateAndTime: [new Date()]
        });
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('dispatchZs').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/modal-size-with-no-of-packet').subscribe((res) => {
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

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.dropdown.filter(option => option.toLowerCase().includes(filterValue));
    }

    submit() {
        if (this.zFoldForm.valid) {
            const sendData = {
                packetModelPerSize: this.zFoldForm.value.packetModelPerSize,
                noOfpacket: this.zFoldForm.value.noOfpacket,
                orderBy: this.zFoldForm.value.orderBy,
                bill: this.zFoldForm.value.bill,
                billNumber: this.zFoldForm.value.billNumber,
                dispatchVia: this.zFoldForm.value.dispatchVia,
                DateAndTime: this.zFoldForm.value.DateAndTime
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('dispatchZs', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.zFoldForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('dispatchZs', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.zFoldForm.reset();
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        this.zFoldForm.patchValue({
            packetModelPerSize: data.packetModelPerSize,
            noOfpacket: data.noOfpacket,
            bill: data.bill,
            billNumber: data.billNumber,
            orderBy: data.orderBy,
            dispatchVia: data.dispatchVia,
            DateAndTime: new Date(data.DateAndTime)
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
                this.service.deleteData('dispatchZs', id).subscribe((res) => {
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

}

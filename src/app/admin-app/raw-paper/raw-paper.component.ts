import {Component, OnInit} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ApiService} from "../../../services/api.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-paper.component.html',
    styleUrl: './raw-paper.component.scss'
})
export class RawPaperComponent implements OnInit {

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    displayedColumns: string[] = ['sizeInMM', 'gsm', 'sizeInMeter', 'pricePerSquareMeters', 'totalSQM', 'totalPrice', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    papers: any[] = [];
    rawPaperForm: FormGroup;

    ngOnInit() {
        this.loadPapers();
        this.rawPaperForm = this.fb.group({
            paperSizeMM: [''],
            paperSizeM: [''],
            gsmOfPaper: [''],
            count: [''],
            pricePerSQM: [''],
            totalPrice: [''],
            entryDate: [new Date()]
        });
    }

    loadPapers() {
        this.service.getData('papers').subscribe((res) => {
            console.log(res);
            this.dataSource = res;
        })
    }

    submitRawPaperEntry() {
        if (this.rawPaperForm.valid) {
            console.log('Raw Paper Entry Submitted', this.rawPaperForm.value);
            const sendData = {
                sizeInMM: this.rawPaperForm.value.paperSizeMM,
                sizeInMeter: this.rawPaperForm.value.paperSizeM,
                pricePerSquareMeters: Number(this.rawPaperForm.value.pricePerSQM),
                gsm: this.rawPaperForm.value.gsmOfPaper,
                count: this.rawPaperForm.value.count,
            }

            if (!this.isEdit) {
                this.service.createData('papers', sendData).subscribe((res) => {
                    if (res) {
                        this.loadPapers();
                        this.rawPaperForm.reset();
                    }
                })
            } else {
                this.service.updateData('papers', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        this.loadPapers();
                        this.isEdit = false;
                        this.rawPaperForm.reset();
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

        this.rawPaperForm.setValue({
            paperSizeMM: data.sizeInMM,
            paperSizeM: data.sizeInMeter,
            gsmOfPaper: data.gsm,
            count: data.count,
            pricePerSQM: data.pricePerSquareMeters,
            totalPrice: data.totalPrice,
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

}

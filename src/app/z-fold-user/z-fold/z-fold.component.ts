import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import {Dropdown, RollDropDown} from '../../roll-user/cutting-plain/cutting-plain.component';

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './z-fold.component.html',
    styleUrl: './z-fold.component.scss'
})
export class ZFoldComponent implements OnInit {

    displayedColumns: string[] = ['jumboEntry', 'modelSize', 'actualPacketPerJumboRoll', 'manufacturedPacketPerJumboRoll', 'difference', 'DateOfEntry', 'action'];
    dataSource: any[] = [];

    zFoldForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    actualPacketDropdown: Dropdown;
    modelSizeDropdown: Dropdown;

    rollDropdown: RollDropDown[];

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.loadDropdown();
        this.loadData();
        this.zFoldForm = this.fb.group({
            jumboEntry: [''],
            modelSize: [''],
            actualPacketPerJumboRoll: [''],
            manufacturedPacketPerJumboRoll: [''],
            difference: [''],
            DateOfEntry: [new Date()]
        });
    }

    loadDropdown() {

        this.service.getData('dropdown/papers').subscribe((res) => {
            if (res.statusCode === 200) {
                this.rollDropdown = res.data;
                console.log("papers", this.rollDropdown);
            }
        })

        this.service.getData('dropdown/category/Actual Packet').subscribe((res) => {
            if (res.statusCode === 200) {
                this.actualPacketDropdown = res.data;
                console.log(this.actualPacketDropdown);
            }
        })

        this.service.getData('dropdown/category/Model Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.modelSizeDropdown = res.data;
                console.log(this.modelSizeDropdown);
            }
        })
    }

    loadData() {
        this.service.getData('zFolds').subscribe((res) => {
            this.dataSource = res;
        });
    }

    submit() {
        if (this.zFoldForm.valid) {
            const sendData = {
                jumboEntry: this.zFoldForm.value.jumboEntry,
                modelSize: this.zFoldForm.value.modelSize,
                actualPacketPerJumboRoll: this.zFoldForm.value.actualPacketPerJumboRoll,
                manufacturedPacketPerJumboRoll: this.zFoldForm.value.manufacturedPacketPerJumboRoll,
                difference: this.zFoldForm.value.difference,
                DateOfEntry: this.zFoldForm.value.DateOfEntry
            };

            if (!this.isEdit) {
                this.service.createData('zFolds', sendData).subscribe((res) => {
                    if (res) {
                        this.loadData();
                        this.zFoldForm.reset();
                    }
                });
            } else {
                this.service.updateData('zFolds', this.elementId, sendData).subscribe((res) => {
                    if (res) {
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

        console.log(data);

        this.zFoldForm.patchValue({
            jumboEntry: data.jumboEntry,
            modelSize: data.modelSize,
            actualPacketPerJumboRoll: data.actualPacketPerJumboRoll.toString(),
            manufacturedPacketPerJumboRoll: data.manufacturedPacketPerJumboRoll,
            difference: data.difference,
            DateOfEntry: new Date(data.DateOfEntry)
        });

        this.zFoldForm.get('jumboEntry')?.disable();
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
                this.service.deleteData('zFolds', id).subscribe((res) => {
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

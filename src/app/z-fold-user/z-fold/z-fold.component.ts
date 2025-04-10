import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import {Dropdown, RollDropDown} from '../../roll-user/cutting-plain/cutting-plain.component';
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

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
    manualModelSizeData : any = null;
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
            manualModelSize: [''],
            modelSize: [''],
            actualPacketPerJumboRoll: [''],
            manufacturedPacketPerJumboRoll: [''],
            difference: [''],
            DateOfEntry: [new Date()]
        });
    }

    loadDropdown() {

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/papers').subscribe((res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                this.rollDropdown = res.data;
            }
        })

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Actual Packet').subscribe((res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                this.actualPacketDropdown = res.data;
                console.log(this.actualPacketDropdown);
            }
        })

        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Model Size').subscribe((res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                this.modelSizeDropdown = res.data;
                console.log(this.modelSizeDropdown);
            }
        })
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('zFolds').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
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
                LoadingSpinnerComponent.show();
                this.service.createData('zFolds', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.zFoldForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('zFolds', this.elementId, sendData).subscribe((res) => {
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
                LoadingSpinnerComponent.show();
                this.service.deleteData('zFolds', id).subscribe((res) => {
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

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return {...data, value: formattedValue};
    }

    manageModelSize() {
        if (this.zFoldForm.value.manualModelSize && this.zFoldForm.value.manualModelSize !== ""){
            if (this.manualModelSizeData !== null){
                this.modelSizeDropdown.options.pop();
            }

            const optionData = {
                label: this.zFoldForm.value.manualModelSize,
                value: this.zFoldForm.value.manualModelSize.toLowerCase().trim()
            }

            const newOptionData = this.convertValues(optionData);

            const exists = this.modelSizeDropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOptionData.value
            );

            if (!exists){
                this.manualModelSizeData = newOptionData;
                this.modelSizeDropdown.options.push(newOptionData);
            }

            this.zFoldForm.get('modelSize')?.setValue(newOptionData.value)
        }else{
            this.modelSizeDropdown.options.pop();
            this.zFoldForm.get('modelSize')?.setValue("")
            this.manualModelSizeData = null;
        }
    }

}

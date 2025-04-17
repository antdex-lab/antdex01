import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import Swal from "sweetalert2";
import { Dropdown, RollDropDown } from '../../roll-user/cutting-plain/cutting-plain.component';
import { LoadingSpinnerComponent } from "../../common/loading-spinner/loading-spinner.component";
import { map, Observable, of, startWith } from 'rxjs';

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
    manualModelSizeData: any = null;
    rollDropdown: RollDropDown[];

    modalSizeControl = new FormControl("", Validators.required);
    modalSizeFilteredOptions: Observable<any[]>;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.loadDropdown();
        this.loadData();
        this.zFoldForm = this.fb.group({
            jumboEntry: ['', Validators.required],
            modelSize: this.modalSizeControl,
            actualPacketPerJumboRoll: ['', Validators.required],
            manufacturedPacketPerJumboRoll: ['', Validators.required],
            difference: ['', Validators.required],
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

        // LoadingSpinnerComponent.show();
        // this.service.getData('dropdown/category/Model Size').subscribe((res) => {
        //     if (res.statusCode === 200) {
        //         LoadingSpinnerComponent.hide();
        //         this.modelSizeDropdown = res.data;
        //         console.log(this.modelSizeDropdown);
        //     }
        // })

        this.loadModalSize();
    }

    loadModalSize() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Model Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.modelSizeDropdown = res.data;
                LoadingSpinnerComponent.hide();

                this.modalSizeFilteredOptions = this.modalSizeControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );
            }
        })
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        if (filterValue === "") {
            this.manageModalSize();
        }
        return this.modelSizeDropdown.options.filter((option: any) => option.label.toLowerCase().includes(filterValue));
    }

    manageModalSize() {
        if (this.modalSizeControl.value && this.modalSizeControl.value !== "") {
            if (this.manualModelSizeData !== null) {
                this.modelSizeDropdown.options.pop();
                this.modalSizeFilteredOptions = of(this.modelSizeDropdown.options)
            }

            const optionData = {
                label: this.modalSizeControl.value,
                value: this.modalSizeControl.value.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.modelSizeDropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.manualModelSizeData = newOption;
                this.modelSizeDropdown.options.push(newOption);
            }

        } else {
            if (this.manualModelSizeData !== null) {
                this.modelSizeDropdown.options.pop();
                this.modalSizeFilteredOptions = of(this.modelSizeDropdown.options)
            }
            this.manualModelSizeData = null;
        }
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
                modelSize: this.modalSizeControl.value,
                actualPacketPerJumboRoll: this.zFoldForm.value.actualPacketPerJumboRoll,
                manufacturedPacketPerJumboRoll: this.zFoldForm.value.manufacturedPacketPerJumboRoll,
                difference: this.zFoldForm.value.difference,
                DateOfEntry: this.zFoldForm.value.DateOfEntry
            };

            if (this.manualModelSizeData !== null) {
                this.service.updateDropdown('dropdown/category', this.modelSizeDropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        console.log("DROPDOWN UPDATED")
                        this.loadModalSize();
                    }
                })
            }

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
        return { ...data, value: formattedValue };
    }

    calculateDifference() {
        if (this.zFoldForm.value.actualPacketPerJumboRoll && this.zFoldForm.value.manufacturedPacketPerJumboRoll) {
            this.zFoldForm.get('difference')?.setValue(Number(this.zFoldForm.value.actualPacketPerJumboRoll) - Number(this.zFoldForm.value.manufacturedPacketPerJumboRoll));
        }
    }
}

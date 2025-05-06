import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";
import {map, Observable, startWith} from 'rxjs';

interface LabelSizeDropdown {
    category: string;
    options: Array<{
        value: string;
        label: string;
    }>;
}

@Component({
    selector: 'app-raw-label',
    templateUrl: './raw-label.component.html',
    styleUrl: './raw-label.component.scss'
})
export class RawLabelComponent implements OnInit {

    displayedColumns: string[] = ['price', 'labelSize', 'labelCount', 'pricePerLabel', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    labelForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    labelSizeData: any[] = [];
    labelSizeControl = new FormControl("", Validators.required);
    labelSizeDropdown: LabelSizeDropdown;
    filteredOptions: Observable<any[]>;

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadDropdown();
        this.loadData();
        this.labelForm = this.fb.group({
            price: ['', Validators.required],
            labels: this.fb.array([this.createLabelGroup()]),
            pricePerLabel: ['', Validators.required],
            dateOfEntry: [new Date()]
        });
    }

    get labelsArray(): FormArray {
        return this.labelForm.get('labels') as FormArray;
    }

    createLabelGroup(): FormGroup {
        return this.fb.group({
            labelSize: this.labelSizeControl,
            labelCount: ['', Validators.required]
        });
    }

    addLabel() {
        if (this.labelsArray.length < 8) {
            this.labelsArray.push(this.createLabelGroup());
        } else {
            Swal.fire('Limit Reached', 'You can only add up to 8 labels.', 'warning');
        }
    }

    removeLabel(index: number) {
        this.labelsArray.removeAt(index);
    }


    loadDropdown() {
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Label Size').subscribe((res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                this.labelSizeDropdown = res.data;

                this.filteredOptions = this.labelSizeControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                );
            }
        })
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.labelSizeDropdown.options.filter(option => option.label.toLowerCase().includes(filterValue));
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('labels').subscribe((res) => {
            LoadingSpinnerComponent.hide();
            this.dataSource = res;
        });
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return { ...data, value: formattedValue };
    }

    manageLabelSize(index : number) {

        if (this.labelsArray.value[index].labelSize && this.labelsArray.value[index].labelSize !== "") {

            const optionData = {
                label: this.labelSizeControl.value,
                value: this.labelsArray.value[index].labelSize.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.labelSizeDropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists) {
                this.labelSizeData.push(newOption);
                this.labelSizeDropdown.options.push(newOption);
            }
        }

        if (this.labelSizeData.length > 0) {
            this.labelSizeData.map((option : any) => {
                console.log(option);
                const findIndex = this.labelsArray.value.findIndex((item :any) => item.labelSize.toLowerCase().trim() === option.label.toLowerCase());
                console.log('findIndex', findIndex);
                if(findIndex === -1){
                    const findLabelDropdownIndex = this.labelSizeDropdown.options.findIndex((item : any) => item.value.toLowerCase() === option.value.toLowerCase());
                    console.log("findLabelDropdownIndex", findLabelDropdownIndex);
                    if (findLabelDropdownIndex !== -1) {
                        this.labelSizeDropdown.options.splice(findLabelDropdownIndex, 1);
                        this.filteredOptions = this.labelSizeControl.valueChanges.pipe(
                            startWith(''),
                            map(value => this._filter(value || ''))
                        );
                    }
                }
            })
        }

    }

    submit() {
        if (this.labelForm.valid) {

            const formValue = this.labelForm.value;

            const sendData = {
                price: this.labelForm.value.price,
                labels: formValue.labels,
                pricePerLabel: this.labelForm.value.pricePerLabel,
                dateOfEntry: this.labelForm.value.dateOfEntry
            };

            if (this.labelSizeData !== null) {
                this.service.updateDropdown('dropdown/category', this.labelSizeDropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        this.loadDropdown();
                    }
                })
            }

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('labels', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.labelForm.reset();
                        this.labelForm.setControl('labels', this.fb.array([this.createLabelGroup()]));
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('labels', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.labelForm.reset();
                        this.labelForm.setControl('labels', this.fb.array([this.createLabelGroup()]));
                    }
                });
            }
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;

        console.log("edit",data)

        // const labelGroups = data.labels.map((label : any) => this.fb.group({
        //     labelSize: [label.labelSize, Validators.required],
        //     labelCount: [label.labelCount, Validators.required]
        // }));

        const labelGroups = data.labels.map((label: any) => {
            return this.fb.group({
                labelSize: [label.labelSize, Validators.required],
                labelCount: [label.labelCount, Validators.required]
            });
        });

        this.labelForm.patchValue({
            price: data.price,
            pricePerLabel: data.pricePerLabel,
            dateOfEntry: new Date(data.dateOfEntry)
        });

        this.labelForm.setControl('labels', this.fb.array(labelGroups));
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
                this.service.deleteData('labels', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Label Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Raw_Label_Data.xlsx');
    }

    calculatePricePerLabel() {
        const {price, labels} = this.labelForm.value;

        let count = 0;
        labels.forEach((label: any) => {
            count += Number(label.labelCount);
        })

        if (price){
            this.labelForm.patchValue({pricePerLabel: Number(price)/ Number(count)});
        }

    }
}

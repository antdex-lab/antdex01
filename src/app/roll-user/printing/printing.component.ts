import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import Swal from "sweetalert2";
import {Dropdown, RollDropDown} from '../cutting-plain/cutting-plain.component';
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './printing.component.html',
    styleUrl: './printing.component.scss'
})
export class PrintingComponent implements OnInit {

    displayedColumns: string[] = ['printingSizePerJumboRoll', 'printingSize','inkColor', 'inkUsed', 'dateOfEntry', 'action'];
    dataSource: any[] = [];

    printingForm: FormGroup;
    isEdit: boolean = false;
    elementId: string = '';

    printingSizeData : any = null;
    inkColorData : any = null;
    dropdown: Dropdown;
    dropdown2: Dropdown;

    rollDropdown: RollDropDown[];

    constructor(
        private service: ApiService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdown();
        this.printingForm = this.fb.group({
            printingSizePerJumboRoll: [''],
            printingSizeManual: [''],
            printingSize: [''],
            inkColorManual: [''],
            inkColor: [''],
            inkUsed: [''],
            dateOfEntry: [new Date()]
        });
    }

    loadDropdown() {
        this.loadPapers();
        this.loadPrintingSize();
        this.loadInkColor();
    }

    loadPapers(){
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/papers').subscribe((res) => {
            if (res.statusCode === 200) {
                this.rollDropdown = res.data;
                LoadingSpinnerComponent.hide();
            }
        })
    }

    loadPrintingSize(){
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Printing Size').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown = res.data;
                LoadingSpinnerComponent.hide();
            }
        })
    }

    loadInkColor(){
        LoadingSpinnerComponent.show();
        this.service.getData('dropdown/category/Ink Color').subscribe((res) => {
            if (res.statusCode === 200) {
                this.dropdown2 = res.data;
                LoadingSpinnerComponent.hide();
            }
        })
    }

    loadData() {
        LoadingSpinnerComponent.show();
        this.service.getData('printings').subscribe((res) => {
            this.dataSource = res;
            LoadingSpinnerComponent.hide();
        });
    }

    convertValues(data: any) {
        let words = data.value.split(" ");
        let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        return {...data, value: formattedValue};
    }

    managePrintingSize() {
        if (this.printingForm.value.printingSizeManual && this.printingForm.value.printingSizeManual !== ""){
            if (this.printingSizeData !== null){
                this.dropdown.options.pop();
            }

            const optionData = {
                label: this.printingForm.value.printingSizeManual,
                value: this.printingForm.value.printingSizeManual.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.dropdown.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists){
                this.printingSizeData = newOption;
                this.dropdown.options.push(newOption);
            }

            this.printingForm.get('printingSize')?.setValue(newOption.value)
        }else{
            this.dropdown.options.pop();
            this.printingForm.get('printingSize')?.setValue("")
            this.printingSizeData = null;
        }
    }

    manageInkColor() {
        if (this.printingForm.value.inkColorManual && this.printingForm.value.inkColorManual !== ""){
            if (this.inkColorData !== null){
                this.dropdown2.options.pop();
            }

            const optionData = {
                label: this.printingForm.value.inkColorManual,
                value: this.printingForm.value.inkColorManual.toLowerCase().trim()
            }

            const newOption = this.convertValues(optionData);

            const exists = this.dropdown2.options.some(
                (opt: any) => opt.value.toLowerCase().trim() === newOption.value
            );

            if (!exists){
                this.inkColorData = newOption;
                this.dropdown2.options.push(newOption);
            }

            this.printingForm.get('inkColor')?.setValue(newOption.value)
        }else{
            this.dropdown2.options.pop();
            this.printingForm.get('inkColor')?.setValue("")
            this.inkColorData = null;
        }
    }

    submit() {
        if (this.printingForm.valid && this.printingForm.value.printingSizePerJumboRoll && this.printingForm.value.printingSize && this.printingForm.value.inkUsed && this.printingForm.value.inkColor) {

            if (this.printingSizeData !== null){
                this.service.updateDropdown('dropdown/category', this.dropdown).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        console.log("DROPDOWN UPDATED")
                    }
                })
            }

            if (this.inkColorData !== null){
                this.service.updateDropdown('dropdown/category', this.dropdown2).subscribe(async (res) => {
                    if (res && res.statusCode === 200) {
                        console.log("DROPDOWN UPDATED")
                    }
                })
            }

            const sendData = {
                printingSizePerJumboRoll: !this.isEdit ?  this.rollDropdown.filter((i) => i.value === this.printingForm.value.printingSizePerJumboRoll)[0].label : this.printingForm.value.printingSizePerJumboRoll,
                id: this.printingForm.value.printingSizePerJumboRoll,
                printingSize: this.printingForm.value.printingSize,
                inkUsed: this.printingForm.value.inkUsed,
                inkColor : this.printingForm.value.inkColor,
                dateOfEntry: this.printingForm.value.dateOfEntry
            };

            if (!this.isEdit) {
                LoadingSpinnerComponent.show();
                this.service.createData('printings', sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.printingForm.reset();
                    }
                });
            } else {
                LoadingSpinnerComponent.show();
                this.service.updateData('printings', this.elementId, sendData).subscribe((res) => {
                    if (res) {
                        LoadingSpinnerComponent.hide();
                        this.loadData();
                        this.isEdit = false;
                        this.printingForm.reset();
                    }
                });
            }
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text : "Please fill required details",
                showCancelButton: false,
                showConfirmButton: false,
                toast : true,
                position: 'top-right',
                timer: 2000,
            })
        }
    }

    editData(data: any) {
        this.isEdit = true;
        this.elementId = data._id;
        // const roll = this.rollDropdown.filter((i) => i.label === data.printingSizePerJumboRoll);

        this.printingForm.patchValue({
            printingSizePerJumboRoll: data.printingSizePerJumboRoll,
            printingSize: data.printingSize,
            inkColor : data.inkColor,
            inkUsed: data.inkUsed,
            dateOfEntry: new Date(data.dateOfEntry)
        });

        this.printingForm.get('printingSizePerJumboRoll')?.disable();

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
                this.service.deleteData('printings', id).subscribe((res) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Printing Data');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Printing_Data.xlsx');
    }

}

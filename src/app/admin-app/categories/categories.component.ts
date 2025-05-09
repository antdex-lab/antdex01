import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";
import {ApiService} from "../../../services/api.service";
import {takeWhile} from "rxjs";
import {NgForOf} from "@angular/common";
import Swal from "sweetalert2";
import {LoadingSpinnerComponent} from "../../common/loading-spinner/loading-spinner.component";

export interface SubCategory {
    label: string;
}

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [MatChipsModule, MatCardModule, MatMenuModule, MatChipsModule, MatIconModule, MatButtonModule, MatTableModule, FormsModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatTooltip],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy, AfterViewInit {

    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    isAlive: boolean = true;
    dynamicDialogForm: FormGroup;
    isEditMode: boolean = false;
    recordId: string = "";

    announcer = inject(LiveAnnouncer);

    displayedColumns: string[] = ['category', 'options', 'action'];
    dataSource = new MatTableDataSource<categoryData>();
    selection = new SelectionModel<categoryData>(true, []);

    options: SubCategory[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private fb: FormBuilder, private apiService: ApiService) {

    }

    ngOnInit(): void {
        this.initForm();
        this.getCategoryList();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.isAlive = false;
    }

    getCategoryList() {
        LoadingSpinnerComponent.show();
        this.apiService.getData('dropdown/all').pipe(takeWhile(() => this.isAlive)).subscribe((res) => {

            if (res.statusCode === 200) {
                this.dataSource.data = res.data.map((item: any) => {

                    item.subCategories = item.options.map((option: any) => option.label)
                    LoadingSpinnerComponent.hide();
                    return {
                        ...item, action: {
                            edit: 'edit',
                            delete: 'delete'
                        }
                    }
                });
            }
        })
    }

    initForm() {
        this.dynamicDialogForm = this.fb.group({
            title: ['']
        });
    }

    convertValues (data : any) {
        return data.map((item : any) => {
            let words = item.value.split(" ");
            let formattedValue = words[0].toLowerCase() + words.slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
            return { ...item, value: formattedValue };
        });
    }

    submitDialog() {

        const optionsData = this.options.map((option: any) => {
            return {
                label: option.label,
                value: option.label.trim(),
            }
        })

        const data = {
            category : this.dynamicDialogForm.value.title,
            options : this.convertValues(optionsData),
        };

        if (this.isEditMode) {
            LoadingSpinnerComponent.show();

            this.apiService.updateDropdown('dropdown/category', data).subscribe(async (res) => {
                if (res && res.statusCode === 200) {
                    LoadingSpinnerComponent.hide();
                    await Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: res.message,
                        showConfirmButton: false,
                        timer: 1500
                    })

                    this.getCategoryList();
                    this.options = [];
                    this.dynamicDialogForm.reset();
                }
            })
        } else {
            LoadingSpinnerComponent.show();

            this.apiService.createData('dropdown/', data).subscribe(async (res) => {
                if (res && res.statusCode === 201) {
                    LoadingSpinnerComponent.hide();

                    await Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: res.message,
                        showConfirmButton: false,
                        timer: 1500
                    })

                    this.getCategoryList();
                    this.options = [];
                    this.dynamicDialogForm.reset();
                }
            })
        }
    }

    editDialog(product: categoryData) {
        this.dynamicDialogForm.patchValue({
            title: product.category
        });

        this.options = product.options;

        this.isEditMode = true;
    }

    deleteDialog(id: string) {
        LoadingSpinnerComponent.show();
        this.apiService.deleteData('dropdown', id).subscribe(async (res) => {
            if (res.statusCode === 200) {
                LoadingSpinnerComponent.hide();
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: res.message,
                    showConfirmButton: false,
                    timer: 1500
                })

                this.getCategoryList();
            }
        })
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.options.push({label: value});
        }

        event.chipInput!.clear();
    }

    remove(subCategory: any): void {
        const index = this.options.indexOf(subCategory);

        if (index >= 0) {
            this.options.splice(index, 1);

            this.announcer.announce(`Removed ${subCategory}`);
        }
    }

    edit(subCategory: any, event: MatChipEditedEvent) {
        const value = event.value.trim();

        if (!value) {
            this.remove(subCategory);
            return;
        }

        const index = this.options.indexOf(subCategory);
        if (index >= 0) {
            this.options[index].label = value;
        }
    }

}

interface categoryData {
    _id: string;
    category: string;
    options: [
        {
            value: string;
            label: string;
        }
    ],
    subCategories: [string]
}

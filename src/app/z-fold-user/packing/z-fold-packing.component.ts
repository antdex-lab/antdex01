import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './z-fold-packing.component.html',
    styleUrl: './z-fold-packing.component.scss'
})
export class ZFoldPackingComponent {

    displayedColumns: string[] = ['taskID', 'taskName', 'assignedTo', 'dueDate', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>([]);


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // isToggled
    isToggled = false;
}

export interface PeriodicElement {
    taskName: string;
    taskID: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    status: any;
    action: any;
}

import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
    selector: 'app-cutting-plain',
    templateUrl: './z-fold-packing.component.html',
    styleUrl: './z-fold-packing.component.scss'
})
export class ZFoldPackingComponent {

    displayedColumns: string[] = ['taskID', 'taskName', 'assignedTo', 'dueDate', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.taskID + 1}`;
    }

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    // isToggled
    isToggled = false;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        taskID: '#951',
        taskName: 'Hotel management system',
        assignedTo: 'Shawn Kennedy',
        dueDate: '15 Nov, 2024',
        priority: 'High',
        status: {
            inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#587',
        taskName: 'Send proposal to APR Ltd',
        assignedTo: 'Roberto Cruz',
        dueDate: '14 Nov, 2024',
        priority: 'Medium',
        status: {
            // inProgress: 'In Progress',
            pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#618',
        taskName: 'Python upgrade',
        assignedTo: 'Juli Johnson',
        dueDate: '13 Nov, 2024',
        priority: 'High',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#367',
        taskName: 'Schedule meeting with Daxa',
        assignedTo: 'Catalina Engles',
        dueDate: '12 Nov, 2024',
        priority: 'Low',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#761',
        taskName: 'Engineering lite touch',
        assignedTo: 'Louis Nagle',
        dueDate: '11 Nov, 2024',
        priority: 'Medium',
        status: {
            inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#431',
        taskName: 'Refund bill payment',
        assignedTo: 'Michael Marquez',
        dueDate: '10 Nov, 2024',
        priority: 'Low',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#421',
        taskName: 'Public beta release',
        assignedTo: 'James Andy',
        dueDate: '09 Nov, 2024',
        priority: 'High',
        status: {
            inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#624',
        taskName: 'Fix platform errors',
        assignedTo: 'Alina Smith',
        dueDate: '08 Nov, 2024',
        priority: 'Medium',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        taskID: '#513',
        taskName: 'Launch our mobile app',
        assignedTo: 'David Warner',
        dueDate: '07 Nov, 2024',
        priority: 'Low',
        status: {
            // inProgress: 'In Progress',
            pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];

export interface PeriodicElement {
    taskName: string;
    taskID: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    status: any;
    action: any;
}

import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY', // Input display format
        monthYearLabel: 'MMM YYYY', // Month and year label in the picker
        dateA11yLabel: 'DD/MM/YYYY', // Accessible date format
        monthYearA11yLabel: 'MMMM YYYY', // Accessible month/year format
    },
};

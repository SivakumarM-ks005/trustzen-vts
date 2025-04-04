import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapterFormats extends NativeDateAdapter {
    // Override the parse method to handle custom input formats
    override parse(value: any): Date | null {
        if (!value) {
            return null;
        }

        if (typeof value === 'string') {
            const parsedDate = this.parseString(value);
            return parsedDate ? parsedDate : null;
        }

        return super.parse(value);
    }

    // Custom parsing logic to support multiple input formats
    private parseString(value: string): Date | null {
        const formats = [
            'dd.MM.yyyy',
            'dd/MM/yyyy',
            'dd-MMM-yyyy',
            'MM.dd.yyyy',
            'MM-dd-yyyy',
            'MM/dd/yyyy',
            'MMM-dd-yyyy',
            'MMM/dd/yyyy',
            'MMM.dd.yyyy',
        ];

        for (const format of formats) {
            const date = this.tryParse(value, format);
            if (date) {
                return date;
            }
        }
        return null;
    }
    private tryParse(value: string, format: string): Date | null {
        const separators = ['.', '/', '-'];
        let parts: string[] = [];
        let separatorUsed = '';

        // Dynamically split based on the separator used in the input
        for (const separator of separators) {
            if (value.includes(separator)) {
                parts = value.split(separator);
                separatorUsed = separator; // Capture the actual separator used in the value
                break;
            }
        }

        if (parts.length !== 3) {
            return null;
        }

        let day: number, month: number, year: number;

        // Check if format starts with 'dd' and validate the actual separator used
        if (format.startsWith('dd') && ['.', '/', '-'].includes(separatorUsed)) {
            if (+parts[1] > 12) {                
                day = +parts[1];
                month = format.includes('MMM')
                ? new Date(`${parts[0]} 1, 2020`).getMonth() // Parse 'MMM' format month
                : +parts[0] - 1; // Convert to zero-based month index
                year = +parts[2];
            } else {
                day = +parts[0];
                month = format.includes('MMM')
                    ? new Date(`${parts[1]} 1, 2020`).getMonth() // Parse 'MMM' format month
                    : +parts[1] - 1; // Convert to zero-based month index
                year = +parts[2];
            }           
        } else if (format.startsWith('MM') && ['.', '/', '-'].includes(separatorUsed)) {
            month = format.includes('MMM')
                ? new Date(`${parts[0]} 1, 2020`).getMonth() // Parse 'MMM' format month
                : +parts[0] - 1;
            day = +parts[1];
            year = +parts[2];
        } else {
            // Fallback for unsupported formats
            return null;
        }

        // Validate date object to ensure it's valid
        const parsedDate = new Date(year, month, day);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Override format method to ensure consistent output in dd-MMM-yyyy format
    // private tryParse(value: string, format: string): Date | null {
    //     const separators = ['.', '/', '-'];
    //     let parts: string[] = [];
    //     let separatorUsed = '';
    
    //     // Dynamically split based on the separator used in the input
    //     for (const separator of separators) {
    //         if (value.includes(separator)) {
    //             parts = value.split(separator);
    //             separatorUsed = separator; // Capture the actual separator used in the value
    //             break;
    //         }
    //     }
    
    //     if (parts.length !== 3) {
    //         return null;
    //     }
    
    //     let day: number, month: number, year: number;
    
    //     // Determine which part of the input is the month and which is the day
    //     if (format.startsWith('dd') && ['.', '/', '-'].includes(separatorUsed)) {
    //         if (+parts[1] >= 12) {                
    //             day = +parts[1];
    //             month = +parts[0];
    //             year = +parts[2];
    //         } else {
    //             day = +parts[0];
    //             month = format.includes('MMM')
    //                 ? new Date(`${parts[1]} 1, 2020`).getMonth() // Parse 'MMM' format month
    //                 : +parts[1] - 1; // Convert to zero-based month index
    //             year = +parts[2];
    //         }
    //         // day = +parts[0];
    //         // month = +parts[1] <= 12 ? +parts[1] - 1 : +parts[2]; // Month (0-based) should be the second part if it's <= 12
    //         // year = +parts[2];
    
    //         // If month value is greater than 12, assume it's the day and reassign parts
    //         // if (month > 11) {
    //         //     month = +parts[2] - 1; // Zero-based month index
    //         //     day = +parts[1];
    //         // }
    //     } else if (format.startsWith('MM') && ['.', '/', '-'].includes(separatorUsed)) {
    //         month = +parts[0] <= 12 ? +parts[0] - 1 : +parts[1] - 1; // Zero-based month index
    //         day = +parts[1];
    //         year = +parts[2];
    
    //         // If month value is greater than 12, assume it's the day and reassign parts
    //         if (month > 11) {
    //             month = +parts[1] - 1; // Zero-based month index
    //             day = +parts[0];
    //         }
    //     } else {
    //         // Fallback for unsupported formats
    //         return null;
    //     }
    
    //     // Validate date object to ensure it's valid
    //     const parsedDate = new Date(year, month, day);
    //     return isNaN(parsedDate.getTime()) ? null : parsedDate;
    // }
    // override format(date: Date, displayFormat: string): string {
    //     if (!date) {
    //         return '';
    //     }

    //     const day = date.getDate();
    //     const month = date.toLocaleString('en-US', { month: 'short' });
    //     const year = date.getFullYear();

    //     return `${day.toString().padStart(2, '0')}-${month}-${year}`;
    // }
    override format(date: Date, displayFormat: string): string {
        if (!date) {
            return '';
        }
        let day: any;
        let month: any;
        let year: any;
        let monthName: any;
        let shortMonthName: any;
    
        switch (displayFormat) {
            case 'DD-MM-YYYY':
                // Return in DD-MM-YYYY format
                day = date.getDate().toString().padStart(2, '0');
                month = (date.getMonth() + 1).toString().padStart(2, '0');
                year = date.getFullYear();
                return `${day}-${month}-${year}`;
    
            case 'MMMM YYYY':
                // Return in 'Month Year' format (e.g., 'January 2020')
                monthName = date.toLocaleString('en-US', { month: 'long' });
                year = date.getFullYear();
                return `${monthName} ${year}`;

            case 'DD-MMM-YYYY':
                // Return in DD-MMM-YYYY format (e.g., '02-Dec-2024')
                day = date.getDate().toString().padStart(2, '0');
                shortMonthName = date.toLocaleString('en-US', { month: 'short' });
                year = date.getFullYear();
                return `${day}-${shortMonthName}-${year}`;    
            default:
                // Fallback in case of an unsupported display format
                return date.toDateString(); // Default formatting
        }
    }
}
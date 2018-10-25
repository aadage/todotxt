export class DateFn {
    //Date parsing regular expressions
    private static get shortDateExpression(): RegExp {
        //yyyy-mm-dd
        return  /(\d{4})-(\d{2})-(\d{2})/g;
    }

    /** 
     * Creates a date object using 1 based year, month and day.
    */
    static Create(year: number, month: number, day: number): Date {
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    static Parse(dateString: string): Date {
        if (this.shortDateExpression.test(dateString)) {
            return this.ParseShortDate(dateString);
        }

        return new Date();
    }
    
    /**
     * Returns the given date as a string in the given format.
     * Make sure formats adhere to this standard:
     *      https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings
     */
    static Format(date: Date, formatString: string = 'yyyy-MM-dd'): string {
        let yearVal: number = date.getFullYear();
        let yyyy: string = yearVal.toString();

        let monthVal: number = date.getMonth() + 1;
        let MM: string = monthVal < 10 ? `0${monthVal.toString()}` : monthVal.toString();

        let dayVal: number = date.getDate();
        let dd: string = dayVal < 10 ? `0${dayVal.toString()}` : dayVal.toString();

        let hourVal: number = date.getHours();
        let hh: string = hourVal < 10 ? `0${hourVal.toString()}` : hourVal.toString();

        let minuteVal: number = date.getMinutes();
        let mm: string = minuteVal < 10 ? `0${minuteVal.toString()}` : minuteVal.toString();

        let secondVal: number = date.getSeconds();
        let ss: string = secondVal < 10 ? `0${secondVal.toString()}` : secondVal.toString();

        let millisecondVal: number = date.getMilliseconds();
        let fff: string = '';
        if (millisecondVal < 10) {
            fff = `00${millisecondVal.toString()}`;
        }
        else if (millisecondVal < 100) {
            fff = `0${millisecondVal.toString()}`;
        }
        else {
            fff = millisecondVal.toString();
        }


        switch (formatString) {
            case 'yyyy-MM-dd-hh-mm-ss-fff':
                return `${yyyy}-${MM}-${dd}-${hh}-${mm}-${ss}-${fff}`;
            default:    //yyyy-MM-dd
                return `${yyyy}-${MM}-${dd}`;
        }
    }

    private static ParseShortDate(dateString: string): Date {
        let matches = this.shortDateExpression.exec(dateString);
        let year: number = 0;
        let month: number = 0;
        let day: number = 0;

        if (matches !== null) {
            year = parseInt(matches[1]);
            month = parseInt(matches[2]);
            day = parseInt(matches[3]);
            return this.Create(year, month, day);
        }

        return new Date();
    }
}

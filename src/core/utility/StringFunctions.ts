export class StrFn {
    /** 
     * Returns true if the given string is null, empty or undefined.
    */
    static IsNullOrEmpty(value: string | null | undefined): boolean {
        return value === null || value === undefined || value.trim().length === 0;
    }
}

export class ArrayFn {
    /** 
     * The IndexWhere() method returns the first index at which the testFunction() evaluates to true,
     * or -1 if the testFunction() doesn't evaluate to true for any elements.
    */
    static IndexWhere<T>(array: Array<T>, testFunction:(item: T) => boolean): number {
        for (let i = 0; i < array.length; i++) {
            let result = testFunction(array[i]);
            if (result) return i;
        }

        return -1;
    }

    /** Makes a copy of the given array. */
    static Copy<T>(array: Array<T>): Array<T> {
        let newArray: Array<T> = new Array<T>();
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }

        return newArray;
    }

    static Where<T>(array: Array<T>, testFunction:(item: T) => boolean): Array<T> {
        let results: Array<T> = new Array<T>();

        for (let i = 0; i < array.length; i++) {
            let match = testFunction(array[i]);
            if (match) results.push(array[i]);
        }

        return results;
    }

    /** Removes the given value from the array.  If the value was removed 
     *  successfully, returns true.  Otherwise, returns false.
     */
    static Remove<T>(array: Array<T>, valueToRemove: T): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === valueToRemove) {
                array.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}
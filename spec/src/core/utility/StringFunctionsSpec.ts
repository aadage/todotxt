import {StrFn} from '../../../../src/core/utility/StringFunctions';

describe("StrFn", function() {
    describe("IsNullOrEmpty()", () => {
        it("returns true if the string is empty.", () => {
            let value: string = '';
            let result: boolean = StrFn.IsNullOrEmpty(value);
            expect(result).toEqual(true);
        });

        it("returns true if the string is null.", () => {
            let value: string | null = null;
            let result: boolean = StrFn.IsNullOrEmpty(value);
            expect(result).toEqual(true);
        });

        it("returns true if the string is undefined.", () => {
            let value: string | null | undefined = undefined;
            let result: boolean = StrFn.IsNullOrEmpty(value);
            expect(result).toEqual(true);
        });
    });
});

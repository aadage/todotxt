import {DateFn} from '../../../../src/core/utility/DateFunctions';

describe("DateFn", function() {
    describe("Create()", () => {
        it("creates a date", () => {
            let date1: Date = DateFn.Create(2013, 7, 4);
            expect(date1.getFullYear()).toEqual(2013);
            expect(date1.getMonth()).toEqual(6);
            expect(date1.getDate()).toEqual(4);
        });
    });

    describe("Parse()", function() {
        it("can parse a date in yyyy-mm-dd format.", () => {
            let tests: Array<[string, Date]> = new Array<[string, Date]>();
            tests.push(["2013-07-04", DateFn.Create(2013, 7, 4)]);
            tests.push(["1970-01-01", DateFn.Create(1970, 1, 1)]);
            tests.push(["2016-02-29", DateFn.Create(2016, 2, 29)]);

            for (let i = 0; i < tests.length; i++) {
                let expectedDate: Date = tests[i][1];
                let parsedDate: Date = DateFn.Parse(tests[i][0]);
                expect(parsedDate).toEqual(expectedDate);
            }
        });
    });

    describe("Format()", function() {
        it("can format a date in yyyy-mm-dd format.", () => {
            let tests: Array<[Date, string]> = new Array<[Date, string]>();
            tests.push([DateFn.Create(2013, 7, 4), "2013-07-04"]);
            tests.push([DateFn.Create(1970, 1, 1), "1970-01-01"]);
            tests.push([DateFn.Create(2016, 2, 29), "2016-02-29"]);

            for (let i = 0; i < tests.length; i++) {
                let expectedFormat: string = tests[i][1];
                let parsedFormat: string = DateFn.Format(tests[i][0]);
                expect(parsedFormat).toEqual(expectedFormat);
            }
        });
    });
});
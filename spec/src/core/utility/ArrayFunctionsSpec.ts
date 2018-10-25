import {ArrayFn} from '../../../../src/core/utility/ArrayFunctions';
import {Task} from '../../../../src/core/domain/Task';

describe('ArrayFn', function() {
    describe('IndexWhere()', () => {
        it('returns the index where the testFunction() returns true.', () => {
            let tasks = new Array<Task>();

            let task1 = new Task();
            task1.Text = 'task1';

            let task2 = new Task();
            task2.Text = 'task2';

            let task3 = new Task();
            task3.Text = 'task3';

            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);

            let index: number = ArrayFn.IndexWhere(tasks, (t) => { return t.Text === 'task1'; });
            expect(index).toEqual(0);
            
            index = ArrayFn.IndexWhere(tasks, (t) => { return t.Text === 'task2'; });
            expect(index).toEqual(1);

            index = ArrayFn.IndexWhere(tasks, (t) => { return t.Text === 'task3'; });
            expect(index).toEqual(2);

            index = ArrayFn.IndexWhere(tasks, (t) => { return t.Text === 'task4'; });
            expect(index).toEqual(-1);
        });
    });

    describe('Where()', () => {
        it('returns all elements matching the testFunction()', () => {
            let items = new Array<string>();
            items.push('test1');
            items.push('what');
            items.push('test2');
            items.push('whoa!');
            items.push('test3');

            let matches: Array<string> = ArrayFn.Where(items, (s) => { 
                return s.indexOf('test') >= 0;
            });

            expect(matches.length).toEqual(3);
            expect(matches[0] === 'test1');
            expect(matches[1] === 'test2');
            expect(matches[2] === 'test3');
        });
    });

    describe('Remove()', () => {
        it('can remove string elements', () => {
            let items = new Array<string>();
            items.push('test1');
            items.push('what');
            items.push('test2');
            items.push('whoa!');
            items.push('test3');

            ArrayFn.Remove(items, 'whoa!');
            expect(items.length).toEqual(4);
            expect(items[0]).toEqual('test1');
            expect(items[1]).toEqual('what');
            expect(items[2]).toEqual('test2');
            expect(items[3]).toEqual('test3');
        });
    });

    describe('Remove()', () => {
        it('can remove number elements', () => {
            let items = new Array<number>();
            items.push(1);
            items.push(2);
            items.push(3);
            items.push(4);

            ArrayFn.Remove(items, 3);
            expect(items.length).toEqual(3);
            expect(items[0]).toEqual(1);
            expect(items[1]).toEqual(2);
            expect(items[2]).toEqual(4);
        });
    });
});

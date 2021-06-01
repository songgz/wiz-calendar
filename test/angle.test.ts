import {Angle} from '../src/angle';

describe('Angle Class', () => {
    test('valueOf method', () => {
        expect(new Angle(1).valueOf()).toBe(1);
    });
});


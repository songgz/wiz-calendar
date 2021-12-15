import '../src/extension'
import {Angle} from '../src/angle';

describe('Angle Class', () => {
    test('valueOf method', () => {
        expect(new Angle(1).valueOf()).toBe(1);
    });

    test('fromRad method', () => {
        expect(Angle.fromRad(Math.PI).valueOf()).toBe(Math.PI);
    });

    test('toNormaliseRad method', () => {
        expect(new Angle(3 * Math.PI).valueOf()).toBe(Math.PI);
        expect(new Angle(-3 * Math.PI).valueOf()).toBe(-Math.PI);
    });

    test('toDMS method', () => {
        expect(new Angle(Math.PI).toDMS()).toBe("+180°00’00.00”");
        expect(new Angle(-3 * Math.PI).toDMS()).toBe("-180°00’00.00”");
    });

    test('+-*/ method', () => {
        expect(Angle.fromRad(1).valueOf() + 1).toBe(2);
    });
});


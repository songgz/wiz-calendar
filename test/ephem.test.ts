import {Earth, Nutation, Sun} from "../src/ephem";

describe('Nutation Class', () => {
    test('long method', () => {
        expect(Nutation.long(2443259.9)).toBeCloseTo(0.06416680980936566, 8);
    });
});

describe('Earth Class', () => {
    test('long method', () => {
        expect(Earth.long(2443259.9, 64)).toBeCloseTo(-8809681237664844000, 8);
    });

    test('v method', () => {
        expect(Earth.v(2443259.9)).toBeCloseTo(2629136343.8131313, 8);
    });
});

describe('Sun Class', () => {
    test('aberrationLong method', () => {
        expect(Sun.longAberration(2443259.9)).toBeCloseTo(62.49560759520799, 8);
    });

    test('aLong method', () => {
        expect(Sun.aLong(2443259.9, 64)).toBeCloseTo(-8809681237664844000, 8);
    });
});

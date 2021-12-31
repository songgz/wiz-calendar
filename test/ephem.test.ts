import {Earth, Moon, SunMoon, Nutation, Sun} from "../src/ephem";

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
    test('longAberration method', () => {
        expect(Sun.longAberration(2443259.9)).toBeCloseTo(62.49560759520799, 8);
    });

    test('aLong method', () => {
        expect(Sun.aLong(2443259.9, 64)).toBeCloseTo(-8809681237664844000, 8);
    });

    test('jc method', () => {
        //console.log(Sun.mjcTT(-133.5176877775662));-0.22027447076688794
        expect(Sun.mjcTT(2443259.9)).toBeCloseTo(3850.507554298232, 8);
    });

    test('jc2 method', () => {
        expect(Sun.jc2(2443259.9)).toBeCloseTo(4032.0006009355775, 8);
    });
});

describe('Moon Class', () => {
    test('long method', () => {
        expect(Moon.long(2443259.9, 64)).toBeCloseTo(-7524816295101071000, 8);
    });

    test('v method', () => {
        expect(Moon.v(2443259.9)).toBeCloseTo(9369.257215821703, 8);
    });
});

describe('MoonPhase Class', () => {
    test('aLongD method', () => {
        expect(SunMoon.aLongD(2443259.9, 20, 10)).toBeCloseTo(1620980256488352800, 8);
    });

    test('jc method', () => {
        expect(SunMoon.mjcTT(2443259.9)).toBeCloseTo(314.39281238895694, 8);
    });

    test('jc2 method', () => {
        expect(SunMoon.jc2(2443259.9)).toBeCloseTo(314.39299994517637, 8);
    });
});

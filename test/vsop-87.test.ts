import {Vsop87} from "../src/vsop-87";


describe('Vsop87 Class', () => {
    test('orbit method', () => {
        expect(Vsop87.earth.orbit(0,2443259.9, 64)).toBeCloseTo(-8809681237664844000, 8);
        expect(Vsop87.earth.orbit(1,2443259.9,64)).toBeCloseTo(-183847948.4187426, 8);
        expect(Vsop87.earth.orbit(2,2443259.9,64)).toBeCloseTo(-66425131384317960, 8);
    });
});

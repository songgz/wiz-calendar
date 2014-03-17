describe("Ephem", function() {

    it("test nutation", function() {
        expect(Lunisolar.Ephem.nutation.lon(2443259.9)).toBeCloseTo( nutationLon2(2443259.9) );
    });

    describe("Computing earth positions", function(){

        it("test lon", function() {
            expect(Lunisolar.Ephem.earth.lon(2443259.9, 64)).toBeCloseTo( XL0_calc(0, 0, 2443259.9, 64) );
        });

        it("test v", function() {
            expect(Lunisolar.Ephem.earth.v(2443259.9)).toBeCloseTo( XL.E_v(2443259.9));
        });

    });

    describe("Computing sun positions", function(){

        it("test gxcLon", function() {
            expect(Lunisolar.Ephem.sun.gxcLon(2443259.9)).toBeCloseTo( gxc_sunLon(2443259.9) );
        });

        it("test aLon", function() {
            expect(Lunisolar.Ephem.sun.aLon(2443259.9)).toBeCloseTo( XL.S_aLon(2443259.9));
        });

        it("test aLon_t", function() {
            expect(Lunisolar.Ephem.sun.aLon_t(2443259.9)).toBeCloseTo( XL.S_aLon_t(2443259.9));
        });

        it("test aLon_t2", function() {
            expect(Lunisolar.Ephem.sun.aLon_t2(2443259.9)).toBeCloseTo( XL.S_aLon_t2(2443259.9));
        });

    });
});
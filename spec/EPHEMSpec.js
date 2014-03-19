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

        it("test term_high", function() {
            expect(Lunisolar.Ephem.sun.term_high(2443259.9)).toBeCloseTo( SSQ.qi_high(2443259.9));
        });

        it("test term_low", function() {
            expect(Lunisolar.Ephem.sun.term_low(2443259.9)).toBeCloseTo( SSQ.qi_low(2443259.9));
        });

    });

    describe("Computing moon positions", function(){

        it("test moon", function() {
            expect(Lunisolar.Ephem.moon.lon(2443259.9, 64)).toBeCloseTo( XL1_calc(0, 2443259.9, 64) );
        });

        it("test v", function() {
            expect(Lunisolar.Ephem.moon.v(2443259.9)).toBeCloseTo( XL.M_v(2443259.9) );
        });

    });

    describe("Computing sun and moon ", function(){

        it("test aLon", function() {
            expect(Lunisolar.Ephem.ms.aLon(2443259.9, 20, 10)).toBeCloseTo( XL.MS_aLon(2443259.9, 20, 10) );
        });

        it("test aLon_t", function(){
            expect(Lunisolar.Ephem.ms.aLon_t(2443259.9)).toBeCloseTo(XL.MS_aLon_t(2443259.9));
        });

        it("test aLon_t2", function(){
            expect(Lunisolar.Ephem.ms.aLon_t2(2443259.9)).toBeCloseTo(XL.MS_aLon_t2(2443259.9));
        });

    });

    describe("Computing moon phases", function(){

        it("test phases_high", function() {
            expect(Lunisolar.Ephem.moon.phases_high(2443259.9)).toBeCloseTo( SSQ.so_high(2443259.9) );
        });

        it("test phases_low", function() {
            expect(Lunisolar.Ephem.moon.phases_low(2443259.9)).toBeCloseTo( SSQ.so_low(2443259.9) );
        });

    });

});
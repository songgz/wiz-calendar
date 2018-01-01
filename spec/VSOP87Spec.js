describe("The JPL's  VSOP87 ephemeris  theory of planetary orbits ", function() {

    describe("Computing planetary positions", function(){

        it("test orbit", function() {
            expect(Lunisolar.VSOP87.earth.orbit(0,2443259.9,64)).toEqual(( XL0_calc(0,0,2443259.9,64)));
            expect(Lunisolar.VSOP87.earth.orbit(1,2443259.9,64)).toEqual(( XL0_calc(0,1,2443259.9,64)));
            expect(Lunisolar.VSOP87.earth.orbit(2,2443259.9,64)).toEqual(( XL0_calc(0,2,2443259.9,64)));

        });


    });


});
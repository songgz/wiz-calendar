describe("ELP/MPP02 ", function() {

    describe("Computing moon positions", function(){

        it("test orbit", function() {

            expect(Lunisolar.MPP02.moon.orbit(0,2443259.9,64)).toBeCloseTo(( XL1_calc(0,2443259.9,64)));
//            expect(Lunisolar.MPP02.moon.orbit(1,2443259.9,64)).toBeCloseTo(( XL1_calc(1,2443259.9,64)));
//            expect(Lunisolar.MPP02.moon.orbit(2,2443259.9,64)).toBeCloseTo(( XL1_calc(2,2443259.9,64)));

        });


    });


});
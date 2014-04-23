describe("Lunisolar", function() {


    beforeEach(function() {

    });

    it("has specified a version number", function() {

        expect(Lunisolar.Calendar.version).toEqual('0.5.1');

    });

    it("test newton", function(){
        var f = function(x){
            return x*x*x + 2*x*x + 3*x + 4;
        };
        expect(Lunisolar.newton(f, -2.0, 0.0, 0.01)).toBeCloseTo(-1.65063);
    });


});
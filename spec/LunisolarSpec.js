describe("Lunisolar", function() {
    var lun;

    beforeEach(function() {
        lun = new Lunisolar.Calendar();
    });

    it("has specified a version number", function() {

        expect(Lunisolar.Calendar.version).toEqual('0.5.1');

    });


});
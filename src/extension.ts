export { } // to make it a module

declare global { // to access the global type String
    interface Math {
        int(v: number): number;
    }

    interface Number {
        toInt(): number
    }
}

Math.int = function(v: number) {
    return v | 0;
};

Number.prototype.toInt = function() {
    return Math[this.valueOf() < 0 ? 'ceil' : 'floor'](this.valueOf());
    //return Math.int(this.valueOf());
};



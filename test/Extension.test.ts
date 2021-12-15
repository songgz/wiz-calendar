import '../src/extension';

describe('Number Extension', () => {
    test('toInt method', () => {
        expect((1.01).toInt()).toBe(1);
        expect((0.99).toInt()).toBe(0);
        expect((-1.01).toInt()).toBe(-1);
        expect((-0.99).toInt()).toBe(0);
    });
});

describe('Math Extension', () => {
    test('int method', () => {
        expect(Math.int(1.01)).toBe(1);
        expect(Math.int(-1.01)).toBe(-1);
        expect(Math.int(0.99)).toBe(0);
        expect(Math.int(-0.99)).toBe(0);
    });
})


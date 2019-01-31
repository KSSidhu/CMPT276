const chip8 = require("./chip8");
// import chip8 from './chip8';

// const 

//test reset function
test('reset function works', () => {
	chip8.reset();

	expect(chip8.pc).toEqual(0x200);
});


beforeEach(() => {
	chip8.reset();
})


test('opcode: 0x000e is correct', () => {
	var opcode = 0x000e;
	chip8.runCycle(opcode);

	var actual = chip8.stack[chip8.sp]

	expect(chip8.sp).toEqual(-1);
	expect(chip8.pc).toEqual(actual + 2);
});


test('opcode: 0x1000 is correct', () => {
	var opcode = 0x1000;
	chip8.runCycle(opcode);
	var actual = opcode & 0x0fff;

	expect(chip8.pc).toEqual(actual);
})

test('opcode: 0x2000 is correct', () => {
	
	var opcode = 0x2000;
	var actual = opcode & 0x0fff

	chip8.runCycle(opcode);

	expect(chip8.stack[chip8.pc]).toEqual(0x200);
	expect(chip8.sp).toEqual(1);
	expect(chip8.pc).toEqual(actual);
	
});


test('opcode: 0x3000 is correct', () => {
	var opcode = 0x3000;
	var x = (opcode & 0x0f00) >> 8;

	chip8.runCycle(opcode); // run iteration with v[x] = 0
	expect(chip8.pc).toEqual(512);

	// chip8.pc = 0x200;
	// chip8.v[x] = opcode & 0x00ff;
	// chip8.runCycle(opcode);
	// expect(chip8.pc).toEqual(514);

});


test('opcode: 0x4000 is correct', () => {
	var opcode = 0x4033;
	var x = (opcode & 0x0f00) >> 8;

	chip8.runCycle(opcode); // run iteration with v[x] = 0

	expect(chip8.pc).toEqual(514); // run iteration with v[x] = 0

	// chip8.v[x] = 0x0033;
	// chip8.runCycle(opcode);
	// expect(chip8.pc).toEqual(514);

});
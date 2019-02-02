const chip8 = require('./chip8');
// import chip8 from './chip8';

// test reset function
test('reset function works', () => {
	chip8.reset();

	// Check static variables
	expect(chip8).toMatchObject({pc: 0x200, sp: 0, i: 0, delayTimer: 0, soundTimer: 0});
	// Check flags
	expect(chip8).toMatchObject({drawFlag: false, loadFlag: false, keyPress: false, keyWait: false});
	// Check arrays for memory, registers and vram
	for(let i = 0; i < chip8.memory.length; i++) {
		expect(chip8.memory[i]).toEqual(0);
		if(i < 16) {
			expect(chip8.v[i]).toEqual(0);
			expect(chip8.stack[i]).toEqual(0);
		} else if (i < 2048) {
			expect(chip8.vram[i]).toEqual(0)
		}
	}

	for(let i = 0; i < chip8.buffer.length; i++) {

			expect(chip8.buffer[i]).toEqual(0);
	}
});

// Rest the chip8 object prior to running any test
beforeEach(() => {
	chip8.reset();
});

test('opcode: 0x00e0 is correct', () => {
	let opcode = 0x0000;
	chip8.runCycle(opcode);
	for(let i = 0; i < chip8.vram.length; i++) {
		expect(chip8.vram[i]).toEqual(0);
	}
});

test('opcode: 0x000e is correct', () => {
	let opcode = 0x000e;
	chip8.sp = 1;

	chip8.runCycle(opcode);

	expect(chip8).toMatchObject({ sp: 0, pc: 0 });
});

test('opcode: 0x1000 is correct', () => {
	let opcode = 0x1000;
	chip8.runCycle(opcode);
	let actual = 0;

	expect(chip8).toMatchObject({ pc: actual });
});

test('opcode: 0x2000 is correct', () => {
	let opcode = 0x2111;

	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({ sp: 1, pc: 0x0111 });
	expect(chip8.stack[0]).toEqual(0x200);
});

test('opcode: 0x3000 is correct', () => {
	let opcode = 0x3111;
	let x = (opcode & 0x0f00) >> 8;

	chip8.v[x] = 17;

	chip8.runCycle(opcode); // run iteration with v[x] = 0
	expect(chip8).toMatchObject({ pc: 514 });

	chip8.v[x] = 1;
	chip8.runCycle(opcode);
	expect(chip8.pc).toEqual(514);
});

test('opcode: 0x4000 is correct', () => {
	var opcode = 0x4011;
	var x = (opcode & 0x0f00) >> 8;
	chip8.v[x] = 0x0011;

	chip8.runCycle(opcode); // run iteration with v[x] = 0

	expect(chip8.pc).toEqual(512); // run iteration with v[x] = 0

	// chip8.reset();

	chip8.v[x] = 0x0033;
	chip8.runCycle(opcode);
	expect(chip8.pc).toEqual(514);
});

test('opcode: 0x5000 is correct', () => {
	let opcode = 0x5000;
	let x = (opcode & 0x0f00) >> 8;
	let y = (opcode & 0x00f0) >> 4;

	chip8.v[y] = 12;
	chip8.v[x] = 12;

	chip8.runCycle(opcode);

	// expect(chip8.pc).toEqual(514); // run iteration with v[x] = 0

	expect(chip8).toMatchObject({ pc: 514 });

	chip8.v[y] = 12;
	chip8.v[x] = 0;

	expect(chip8).toMatchObject({ pc: 514 });
});

test('opcode: 0x6000 is correct', () => {
	let opcode = 0x6011;
	var x = (opcode & 0x0f00) >> 8;

	chip8.runCycle(opcode);

	expect(chip8.v[x]).toEqual(17);
	expect(chip8).toMatchObject({ pc: 514 });
});

test('opcode: 0x7000 is correct', () => {
	let opcode = 0x7011;
	var x = (opcode & 0x0f00) >> 8;

	chip8.v[x] = 17;

	chip8.runCycle(opcode);

	expect(chip8.v[x]).toEqual(34);
	expect(chip8).toMatchObject({ pc: 514 });
});

test('opcode: 0x8000 is correct', () => {
	let opcode = 0x8120;

	let y = (opcode & 0x00f0) >> 4;
	let x = (opcode & 0x0f00) >> 8;


	chip8.v[y] = 17;
	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 514});
	expect(chip8.v[x]).toEqual(17);

	chip8.v[x] = 0;
	chip8.runCycle(0x8121);
	expect(chip8.v[x]).toEqual(17);
	expect(chip8).toMatchObject({pc: 516});

	chip8.v[x] = 0
	chip8.runCycle(0x8122);
	expect(chip8.v[x]).toEqual(0);
	expect(chip8).toMatchObject({pc: 518});

	chip8.v[x] = 0;
	chip8.runCycle(0x8123);
	expect(chip8.v[x]).toEqual(17);
	expect(chip8).toMatchObject({pc: 520});

	chip8.v[x] = 0;
	chip8.runCycle(0x8124);
	expect(chip8.v[x]).toEqual(17);
	expect(chip8.v[0xf]).toEqual(0);
	expect(chip8).toMatchObject({pc: 522});

	chip8.v[x] = 0;
	chip8.runCycle(0x8125);
	expect(chip8.v[0xf]).toEqual(0);
	expect(chip8).toMatchObject({pc: 524});

	chip8.v[x] = 1;
	chip8.runCycle(0x8126);
	expect(chip8.v[0xf]).toEqual(1);
	expect(chip8.v[x]).toEqual(0);
	expect(chip8).toMatchObject({pc: 526});

	chip8.reset();
	chip8.v[x] = 0;
	chip8.runCycle(0x8127);
	expect(chip8.v[0xf]).toEqual(0);
	expect(chip8.v[x]).toEqual(0);
	expect(chip8).toMatchObject({pc: 514});

});


test('opcode: 0x9000 is correct', () => {
	let opcode = 0x9140;

	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 512});
}); 


test('opcode: 0xa000 is correct', () => {
	let opcode = 0xa140;

	chip8.runCycle(opcode);
	expect(chip8.i).toEqual(0x0140);
	expect(chip8).toMatchObject({pc: 514});
}); 

test('opcode: 0xb000 is correct', () => {
	let opcode = 0xb123;

	chip8.v[0] = 12;

	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 0x0123 + 12});
});


test('opcode: 0xc000 is correct', () => {
	let opcode = 0xc123;
	let x = (opcode & 0x0f00) >> 8;

	chip8.v[0] = 12;

	chip8.runCycle(opcode);
	// expect(chip8.v[x]).not.toBe(0);
	expect(chip8).toMatchObject({pc: 514});
}); 


test('opcode: 0xe000 is correct', () => {
	let opcode = 0xe09e;
	let x = (opcode & 0x0f00) >> 8;
	chip8.buffer[0] = 1;

	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 514});

	opcode = 0xe0a1;
	chip8.buffer[0] = 0;
	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 516});
}); 


test('opcode: 0xf000 is correct', () => {
	let opcode = 0xf007;
	let x = (opcode & 0x0f00) >> 8;
	chip8.delayTimer = 12;
	chip8.runCycle(opcode);

	expect(chip8).toMatchObject({pc: 514});
	expect(chip8.v[x]).toEqual(12);

	chip8.v[x] = 11
	opcode = 0xf015;
	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 516, delayTimer: 11});

	opcode = 0xf018;
	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 518, soundTimer: 11});

	opcode = 0xf01e;
	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 520, i: 11});

	opcode = 0xf029;
	chip8.runCycle(opcode);
	expect(chip8).toMatchObject({pc: 522, i: 55});

	opcode = 0xf033;
	chip8.v[x] = 101;
	chip8.i = 0;
	let index = 0;
	chip8.runCycle(opcode);
	expect(chip8.memory[chip8.i]).toEqual(1);
	expect(chip8.memory[chip8.i + 1]).toEqual(0);
	expect(chip8.memory[chip8.i + 2]).toEqual(1);

});